import jsPDF from "jspdf";
import { Certificate } from "@/api/quiz";

/**
 * Genera un PDF de certificado de forma programática con jsPDF.
 * No depende de html2canvas ni del DOM — funciona en cualquier contexto.
 */
export function generateCertificatePDF(certificate: Certificate): void {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const centerX = pageWidth / 2;

  // ===== Fondo =====
  pdf.setFillColor(255, 251, 235); // amber-50
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // ===== Borde decorativo =====
  pdf.setDrawColor(245, 158, 11); // amber-500
  pdf.setLineWidth(2);
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
  pdf.setLineWidth(0.5);
  pdf.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // ===== Ícono de premio (estrella simple) =====
  pdf.setFillColor(217, 119, 6); // amber-600
  const starY = 35;
  // Círculo como placeholder del ícono
  pdf.circle(centerX, starY, 8, "F");
  pdf.setFillColor(255, 251, 235);
  pdf.circle(centerX, starY, 5, "F");
  pdf.setFillColor(217, 119, 6);
  pdf.circle(centerX, starY, 3, "F");

  // ===== Título =====
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(36);
  pdf.setTextColor(120, 53, 15); // amber-900
  pdf.text("Certificado", centerX, 55, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(180, 83, 9); // amber-700
  pdf.text("de Finalización Exitosa", centerX, 63, { align: "center" });

  // ===== Línea decorativa =====
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(1.5);
  pdf.line(centerX - 25, 70, centerX + 25, 70);

  // ===== "Se certifica que" =====
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(55, 65, 81); // gray-700
  pdf.text("Se certifica que", centerX, 85, { align: "center" });

  // ===== Nombre del usuario =====
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.setTextColor(17, 24, 39); // gray-900
  const userName = certificate.user_name || "Estudiante";
  pdf.text(userName, centerX, 97, { align: "center" });

  // Línea bajo el nombre
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(0.8);
  const nameWidth = Math.max(pdf.getTextWidth(userName), 80);
  pdf.line(centerX - nameWidth / 2, 100, centerX + nameWidth / 2, 100);

  // ===== "ha completado exitosamente el curso" =====
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(55, 65, 81);
  pdf.text("ha completado exitosamente el curso", centerX, 112, {
    align: "center",
  });

  // ===== Nombre del curso (con recuadro) =====
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(17, 24, 39);
  const courseTitle = certificate.course_title || "Curso";
  const courseTitleWidth = Math.max(pdf.getTextWidth(courseTitle) + 20, 100);

  // Recuadro
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(1);
  pdf.roundedRect(
    centerX - courseTitleWidth / 2,
    117,
    courseTitleWidth,
    22,
    3,
    3,
    "FD",
  );

  pdf.text(courseTitle, centerX, 127, { align: "center" });

  // Porcentaje de avance
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(75, 85, 99); // gray-600
  pdf.text(
    `con un ${certificate.completion_percentage}% de avance`,
    centerX,
    135,
    { align: "center" },
  );

  // ===== Número de certificado =====
  pdf.setFontSize(10);
  pdf.setTextColor(55, 65, 81);
  pdf.text(`Certificado No. ${certificate.certificate_number}`, centerX, 152, {
    align: "center",
  });

  // ===== Línea inferior =====
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(1);
  pdf.line(30, 165, pageWidth - 30, 165);

  // ===== Fecha de emisión =====
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(55, 65, 81);
  const issueDate = new Date(certificate.issue_date).toLocaleDateString(
    "es-ES",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
  pdf.text(`Emitido el ${issueDate}`, centerX, 175, { align: "center" });

  // ===== Footer =====
  pdf.setFontSize(8);
  pdf.setTextColor(156, 163, 175); // gray-400
  pdf.text("vallenatofemenino.com", centerX, 190, { align: "center" });

  // ===== Guardar =====
  pdf.save(`certificado-${certificate.certificate_number}.pdf`);
}
