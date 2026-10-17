import type { CoverLetterForm } from '@/types/coverLetter';
import { formatDateID } from './cvData';

function fullName(form: CoverLetterForm): string {
  return form.applicantName.trim();
}

function greeting(form: CoverLetterForm): string {
  return form.recipientName.trim()
    ? `Yth. ${form.recipientName.trim()}`
    : 'Yth. Human Capital Department';
}

function companyLine(form: CoverLetterForm): string {
  return form.companyName.trim() ? `di ${form.companyName.trim()}` : '';
}

function vacancyLine(form: CoverLetterForm): string {
  const src = form.vacancySource.trim();
  return src ? ` yang saya lihat melalui ${src}` : '';
}

export interface GeneratedLetter {
  subject?: string;
  content: string;
}

export function generateCoverLetter(form: CoverLetterForm): GeneratedLetter {
  const name = fullName(form);
  const tanggal = form.city.trim()
    ? `${form.city.trim()}, ${formatDateID(form.date)}`
    : formatDateID(form.date);
  const perihal = form.position.trim()
    ? `Permohonan Lamaran Posisi ${form.position.trim()}`
    : 'Permohonan Lamaran Pekerjaan';
  const skills = form.skills.trim();
  const exp = form.experience.trim();
  const edu = form.education.trim();
  const reason = form.reason.trim();
  const closing = form.closing.trim() ||
    'Besarnya harapan saya untuk dapat diberikan kesempatan mengikuti tahap seleksi selanjutnya. Atas perhatian dan waktu yang Bapak/Ibu berikan, saya ucapkan terima kasih.';
  const company = form.companyName.trim();
  const position = form.position.trim();
  const posAt = company ? `${position || 'posisi yang tersedia'} di ${company}` : position || 'posisi yang tersedia';

  const contact =
    form.email.trim() && form.phone.trim()
      ? `${form.email.trim()} | ${form.phone.trim()}`
      : form.email.trim() || form.phone.trim() || '';

  if (form.templateId === 'email') {
    const lines = [
      `Kepada Tim Rekrutmen${company ? ` ${company}` : ''},`,
      '',
      `Dengan hormat, saya ${name || '[nama Anda]'} tertarik untuk melamar posisi ${posAt}${vacancyLine(form)}.`,
      '',
    ];
    if (edu) lines.push(`Saya memiliki latar belakang pendidikan ${edu}.`);
    if (exp) lines.push(exp.endsWith('.') ? exp : `${exp}.`);
    if (skills) lines.push(`Keahlian yang saya miliki di antaranya ${skills}.`);
    if (reason) lines.push('', reason.endsWith('.') ? reason : `${reason}.`);
    lines.push(
      '',
      closing,
      '',
      'Terima kasih atas waktu dan perhatian Bapak/Ibu. Saya menantikan kabar baik dari tim rekrutmen.',
      '',
      'Hormat saya,',
      name || '[nama Anda]',
    );
    if (contact) lines.push(contact);
    return { subject: perihal, content: lines.join('\n') };
  }

  if (form.templateId === 'internship') {
    const lines = [
      tanggal,
      '',
      greeting(form),
      companyLine(form),
      '',
      `Perihal: Permohonan Magang Posisi ${position || '[posisi magang]'}`,
      '',
      'Dengan hormat,',
      '',
      `Saya, ${name || '[nama Anda]'}, merupakan pelamar posisi magang ${posAt}${vacancyLine(form)}.`,
    ];
    if (edu) lines.push(`Saat ini saya memiliki latar belakang pendidikan ${edu}.`);
    if (exp) lines.push(exp.endsWith('.') ? exp : `${exp}.`);
    if (skills) lines.push(`Kemampuan yang dapat saya kontribusikan di antaranya ${skills}.`);
    if (reason) lines.push('', reason.endsWith('.') ? reason : `${reason}.`);
    lines.push(
      '',
      closing,
      '',
      'Sebagai bahan pertimbangan, saya melampirkan curriculum vitae dan dokumen pendukung lainnya.',
      '',
      'Hormat saya,',
      name || '[nama Anda]',
    );
    if (contact) lines.push(contact);
    return { content: lines.join('\n') };
  }

  const lines = [
    tanggal,
    '',
    greeting(form),
    companyLine(form),
    '',
    `Perihal: ${perihal}`,
    '',
    'Dengan hormat,',
    '',
    `Saya, ${name || '[nama Anda]'}, bermaksud mengajukan lamaran untuk posisi ${posAt}${vacancyLine(form)}.`,
  ];

  if (form.templateId === 'fresh-graduate') {
    if (edu) lines.push(`Saya merupakan lulusan dengan latar belakang pendidikan ${edu}.`);
    if (exp) lines.push(exp.endsWith('.') ? exp : `${exp}.`);
    if (skills) lines.push(`Selama studi, saya mengembangkan kemampuan di antaranya ${skills}.`);
    lines.push(
      '',
      'Sebagai fresh graduate yang antusias, saya siap belajar, beradaptasi, dan memberikan kontribusi terbaik untuk tim.',
    );
  } else if (form.templateId === 'experienced') {
    if (exp) lines.push(exp.endsWith('.') ? exp : `${exp}.`);
    if (edu) lines.push(`Latar belakang pendidikan saya adalah ${edu}.`);
    if (skills) lines.push(`Keahlian utama yang saya miliki di antaranya ${skills}.`);
  } else {
    if (edu) lines.push(`Saya memiliki latar belakang pendidikan ${edu}.`);
    if (exp) lines.push(exp.endsWith('.') ? exp : `${exp}.`);
    if (skills) lines.push(`Keahlian yang saya miliki di antaranya ${skills}.`);
  }

  if (reason) lines.push('', reason.endsWith('.') ? reason : `${reason}.`);
  lines.push(
    '',
    closing,
    '',
    'Sebagai bahan pertimbangan, saya melampirkan curriculum vitae dan dokumen pendukung lainnya.',
    '',
    'Hormat saya,',
    '',
    name || '[nama Anda]',
  );
  if (contact) lines.push(contact);
  return { content: lines.join('\n') };
}
