import { signOutAction } from "../../app/auth/actions";

interface Props {
  userEmail?: string;
}

export function DashHeader({ userEmail }: Props) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{userEmail}</span>
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold">
          {userEmail?.[0]?.toUpperCase() ?? "U"}
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </header>
  );
}
