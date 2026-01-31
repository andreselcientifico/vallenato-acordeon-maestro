import { useState } from "react";
import { Certificate, downloadCertificatePDF } from "@/api/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, Award, CheckCircle2, Calendar } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateCardProps {
  certificate: Certificate;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
}) => {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);

      // Obtener el elemento del certificado
      const certificateElement = document.getElementById(
        `certificate-${certificate.id}`
      );

      if (!certificateElement) {
        // Fallback: descargar desde el servidor
        const blob = await downloadCertificatePDF(certificate.id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificado-${certificate.certificate_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Generar PDF desde el elemento HTML
        const canvas = await html2canvas(certificateElement, {
          scale: 2,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 297; // A4 width en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`certificado-${certificate.certificate_number}.pdf`);
      }

      toast({
        title: "Éxito",
        description: "Certificado descargado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al descargar el certificado",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Certificate Preview */}
      <div id={`certificate-${certificate.id}`} className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 print:bg-white">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Header */}
          <div className="w-full pt-4">
            <Award className="w-12 h-12 text-amber-600 mx-auto mb-2" />
            <h2 className="text-4xl font-bold text-amber-900">Certificado</h2>
            <p className="text-amber-700 text-sm">de Finalización Exitosa</p>
          </div>

          <div className="w-32 h-1 bg-amber-400"></div>

          {/* Body */}
          <div className="space-y-4 w-full py-8">
            <p className="text-gray-700 text-sm">
              Se certifica que
            </p>

            <div className="border-b-2 border-amber-400 pb-2">
              <p className="text-2xl font-bold text-gray-900">
                {certificate.user_name}
              </p>
            </div>

            <p className="text-gray-700">
              ha completado exitosamente el curso
            </p>

            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border-2 border-amber-400">
              <p className="text-xl font-bold text-gray-900">
                {certificate.course_title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                con un {certificate.completion_percentage}% de avance
              </p>
            </div>

            <p className="text-gray-700 text-sm pt-4">
              Certificado No. {certificate.certificate_number}
            </p>
          </div>

          {/* Footer */}
          <div className="w-full border-t-2 border-amber-400 pt-6 mt-6">
            <p className="text-gray-700 text-sm">
              <Calendar className="w-4 h-4 inline mr-1" />
              Emitido el{" "}
              {new Date(certificate.issue_date).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-gray-900">
            {certificate.course_title}
          </span>
        </div>
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="gap-2"
          size="sm"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Descargando..." : "Descargar PDF"}
        </Button>
      </div>
    </Card>
  );
};

interface CertificatesListProps {
  certificates: Certificate[];
  isLoading?: boolean;
}

export const CertificatesList: React.FC<CertificatesListProps> = ({
  certificates,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin">
            <Award className="w-8 h-8 text-amber-600 mx-auto" />
          </div>
          <p>Cargando certificados...</p>
        </div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <Card className="p-12 text-center bg-gray-50">
        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-600">
          No tienes certificados aún
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Completa y aprueba los quizzes de los cursos para desbloquear certificados
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {certificates.map((cert) => (
        <CertificateCard key={cert.id} certificate={cert} />
      ))}
    </div>
  );
};
