import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CVEditor from '@/components/cv/CVEditor';
import { ToastProvider } from '@/components/ui/Toast';
import { cvStorage } from '@/lib/storage';
import { exportNodeToPdf } from '@/lib/exportPdf';

vi.mock('@/lib/exportPdf', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/exportPdf')>();
  return { ...actual, exportNodeToPdf: vi.fn().mockResolvedValue(undefined) };
});

function renderEditor(initialEntries = ['/buat-cv']) {
  return render(
    <MemoryRouter initialEntries={initialEntries} initialIndex={0}>
      <ToastProvider>
        <CVEditor />
      </ToastProvider>
    </MemoryRouter>,
  );
}

/** Click "Tambah Pendidikan" then fill the row that appears. */
async function addEducation(user: ReturnType<typeof userEvent.setup>, data: { institution: string; major: string; start: string; end: string }) {
  await user.click(screen.getByRole('button', { name: /tambah pendidikan/i }));
  await user.type(screen.getByLabelText('Nama institusi'), data.institution);
  await user.type(screen.getByLabelText('Jurusan'), data.major);
  const start = screen.getByLabelText(/^Tahun mulai/);
  await user.clear(start);
  await user.type(start, data.start);
  const end = screen.getByLabelText(/^Tahun selesai/);
  await user.clear(end);
  await user.type(end, data.end);
}

describe('Alur lengkap pembuatan CV (integrasi)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.mocked(exportNodeToPdf).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pengguna baru dapat mengisi CV dari nol sampai tersimpan', { timeout: 20000 }, async () => {
    const user = userEvent.setup();
    renderEditor();

    // 1. Isi informasi pribadi
    await user.type(screen.getByLabelText(/^Nama lengkap/), 'Budi Santoso');
    await user.type(screen.getByLabelText(/^Email$/), 'budi@contoh.email');
    await user.type(screen.getByLabelText(/^Nomor telepon/), '0812 3456 7890');
    await user.type(screen.getByLabelText(/^Kota$/), 'Jakarta');

    // 2. Tambah pendidikan
    await addEducation(user, { institution: 'Universitas Contoh', major: 'Ilmu Komunikasi', start: '2020', end: '2024' });

    // 3. Tambah keahlian via Enter
    const skillInput = screen.getByLabelText('Tambah keahlian');
    await user.type(skillInput, 'Microsoft Excel{Enter}');
    await user.type(skillInput, 'Komunikasi{Enter}');

    // 4. Data tersimpan otomatis (debounce 600ms)
    await waitFor(
      () => {
        const saved = cvStorage.load().data;
        expect(saved?.personal.fullName).toBe('Budi Santoso');
      },
      { timeout: 2000 },
    );
    const saved = cvStorage.load().data;
    expect(saved?.personal.email).toBe('budi@contoh.email');
    expect(saved?.education).toHaveLength(1);
    expect(saved?.education[0].institution).toBe('Universitas Contoh');
    expect(saved?.education[0].startYear).toBe('2020');
    expect(saved?.skills.map((s) => s.name)).toEqual(['Microsoft Excel', 'Komunikasi']);

    // 5. Preview menampilkan data yang diketik
    const preview = screen.getByText('Preview CV').closest('div')!.parentElement!;
    await waitFor(() => {
      expect(within(preview.parentElement ?? document.body).getByText('Budi Santoso')).toBeInTheDocument();
    });
    expect(screen.getAllByText('Universitas Contoh').length).toBeGreaterThan(0);
  });

  it('keahlian duplikat (beda huruf besar-kecil) ditolak', async () => {
    const user = userEvent.setup();
    renderEditor();
    const skillInput = screen.getByLabelText('Tambah keahlian');
    await user.type(skillInput, 'Excel{Enter}');
    await user.type(skillInput, 'excel{Enter}');
    await waitFor(() => expect(cvStorage.load().data?.skills).toHaveLength(1), { timeout: 2000 });
  });

  it('ekspor diblokir saat nama kosong, lalu berhasil setelah nama diisi', async () => {
    const user = userEvent.setup();
    renderEditor();

    // Tanpa nama: validasi gagal, PDF TIDAK dibuat
    await user.click(screen.getByRole('button', { name: /unduh pdf/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/nama lengkap wajib diisi/i).length).toBeGreaterThan(0);
    });
    expect(exportNodeToPdf).not.toHaveBeenCalled();

    // Isi nama lalu coba lagi: PDF dibuat dengan nama file yang benar
    await user.type(screen.getByLabelText(/^Nama lengkap/), 'Budi Santoso');
    await user.click(screen.getByRole('button', { name: /unduh pdf/i }));
    await waitFor(() => {
      expect(exportNodeToPdf).toHaveBeenCalledTimes(1);
    });
    const [node, filename] = vi.mocked(exportNodeToPdf).mock.calls[0];
    expect(filename).toBe('CV-Budi-Santoso.pdf');
    expect(node.querySelector('h1')?.textContent).toContain('Budi Santoso');
  });

  it('ganti template tidak menghapus data', async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.type(screen.getByLabelText(/^Nama lengkap/), 'Budi Santoso');
    await addEducation(user, { institution: 'Universitas Contoh', major: 'Akuntansi', start: '2019', end: '2023' });

    const tplSelect = screen.getByLabelText('Pilih template CV');
    await user.selectOptions(tplSelect, 'modern-professional');
    await user.selectOptions(tplSelect, 'creative');
    await user.selectOptions(tplSelect, 'fresh-graduate');

    // Data masih utuh
    expect(screen.getByLabelText(/^Nama lengkap/)).toHaveValue('Budi Santoso');
    expect(screen.getByLabelText(/^Nama institusi/)).toHaveValue('Universitas Contoh');
    await waitFor(() => {
      expect(cvStorage.load().data?.templateId).toBe('fresh-graduate');
    });
  });

  it('tahun selesai lebih awal menampilkan error di dekat field dan blokir ekspor', async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.type(screen.getByLabelText(/^Nama lengkap/), 'Budi Santoso');
    await addEducation(user, { institution: 'Universitas Contoh', major: 'Akuntansi', start: '2022', end: '2020' });

    await user.click(screen.getByRole('button', { name: /unduh pdf/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/tahun selesai tidak boleh lebih awal/i).length).toBeGreaterThan(0);
    });
    expect(exportNodeToPdf).not.toHaveBeenCalled();
  });

  it('pendidikan yang masih berlangsung menonaktifkan tahun selesai', async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole('button', { name: /tambah pendidikan/i }));
    const endInput = screen.getByLabelText(/^Tahun selesai/);
    expect(endInput).toBeEnabled();

    await user.click(screen.getByRole('checkbox', { name: /masih berlangsung/i }));
    expect(endInput).toBeDisabled();
  });

  it('entri pendidikan dapat dihapus', async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.type(screen.getByLabelText(/^Nama lengkap/), 'Budi Santoso');
    await addEducation(user, { institution: 'Universitas Contoh', major: 'Akuntansi', start: '2019', end: '2023' });
    expect(screen.getByLabelText(/^Nama institusi/)).toHaveValue('Universitas Contoh');

    await user.click(screen.getByRole('button', { name: 'Hapus Universitas Contoh' }));
    expect(screen.queryByLabelText(/^Nama institusi/)).not.toBeInTheDocument();
  });

  it('reset formulir mengosongkan CV tanpa menghapus draft surat lamaran', async () => {
    const user = userEvent.setup();
    renderEditor();
    window.localStorage.setItem(
      'cvmudah:cover-letter',
      JSON.stringify({ applicantName: 'Ani', templateId: 'formal' }),
    );
    await user.type(screen.getByLabelText(/^Nama lengkap/), 'Budi Santoso');
    await waitFor(() => expect(cvStorage.load().data?.personal.fullName).toBe('Budi Santoso'), { timeout: 2000 });

    await user.click(screen.getByRole('button', { name: 'Reset Formulir' }));
    await user.click(screen.getByRole('button', { name: /ya, kosongkan formulir/i }));

    expect(screen.getByLabelText(/^Nama lengkap/)).toHaveValue('');
    await waitFor(() => {
      expect(cvStorage.load().data?.personal.fullName).toBe('');
    });
    expect(window.localStorage.getItem('cvmudah:cover-letter')).not.toBeNull();
  });

  it('template dari galeri diterapkan lewat navigation state', async () => {
    renderEditor(
      [{ pathname: '/buat-cv', state: { templateId: 'creative' } }] as never,
    );
    const tplSelect = screen.getByLabelText('Pilih template CV') as HTMLSelectElement;
    expect(tplSelect.value).toBe('creative');
  });

  it('indikator autosave muncul lalu menjadi Tersimpan', async () => {
    const user = userEvent.setup();
    renderEditor();
    await user.type(screen.getByLabelText(/^Nama lengkap/), 'Budi Santoso');
    await waitFor(() => {
      expect(screen.getByText('Menyimpan...')).toBeInTheDocument();
    }, { timeout: 2000 });
    await waitFor(() => {
      expect(screen.getByText('Tersimpan')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
