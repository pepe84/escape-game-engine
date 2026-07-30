import { FolderGit2 } from "lucide-react";
import I18nLanguageSelector from "../../i18n/I18nLanguageSelector"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 text-sm text-slate-600 py-4 px-6">
      <div className="flex items-center justify-between gap-2">
        <a
          href="https://github.com/pepe84/escape-game-engine"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-slate-900"
        >
          <FolderGit2 size={18} />
          <span>GNU General Public License v3.0</span>
        </a>
        <div className="input-group">
            <span className="input-group-text mr-2">💬</span>
            <I18nLanguageSelector/>
        </div>        
      </div>
    </footer>
  );
}