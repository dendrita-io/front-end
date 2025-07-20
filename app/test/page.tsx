import { ConnectionTest } from "@/components/connection-test"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-serif font-bold mb-8">Página de Pruebas - Dendrita</h1>

        <div className="space-y-6">
          <ConnectionTest />

          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-4">Próximos pasos</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Ejecutar los scripts SQL en tu dashboard de Supabase</li>
              <li>Probar el registro de un nuevo usuario</li>
              <li>Verificar que se cree el perfil automáticamente</li>
              <li>Probar la creación y edición de notas</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
