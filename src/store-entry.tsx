import App from './App';
import './index.css';

export interface StoreEntryProps {
  userId?: string;
  onExit?: () => void;
  onScore?: (score: number) => void;
}

export default function StoreEntry(props: StoreEntryProps) {
  return (
    <div className="sub-app-root w-full h-full">
      <App {...props} />
    </div>
  );
}
