interface QrCodeViewProps {
  onBack: () => void
}

export const QrCodeView = ({ onBack }: QrCodeViewProps) => (
  <div className="qr-view">
    <button type="button" className="btn-secondary" onClick={onBack}>
      &larr; Back to search
    </button>

    <div className="qr-card">
      <img src="/qr-code.svg" alt="QR code linking to this website" className="qr-image" />
      <p className="qr-caption">Scan to open this page</p>
    </div>
  </div>
)
