import Link from "next/link";

export default function RootPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Marca */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-700 text-white text-3xl font-bold mb-6 shadow-md">
          SH
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sistema Hospitalario
        </h1>
        <p className="text-sm text-gray-500 mb-1">SENA CEET · ADSO</p>
        <p className="text-sm text-gray-400 mb-10">
          Plataforma de gestión clínica integral
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-4">
          <Link
            href="/login"
            className="block w-full py-3 text-sm font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors text-center"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="block w-full py-3 text-sm font-semibold text-green-700 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-center"
          >
            Crear cuenta
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} Sistema Hospitalario · SENA
        </p>
      </div>
    </div>
  );
}
