export interface OrderPreviewListItemTextProps {
  primaryText?: string;
  secondaryText?: string;
  tertiaryText?: string;
}

const OrderPreviewListItemText = ({
  primaryText,
  secondaryText,
  tertiaryText,
}: OrderPreviewListItemTextProps) => {
  return (
    <div className="d-flex flex-column gap-0-8">
      {primaryText && (
        <p className="codGray900 fs14 fontRegular">ID: {primaryText}</p>
      )}

      {secondaryText && (
        <p className="fs16 fontBold codGray950">{secondaryText}</p>
      )}

      {tertiaryText && (
        <p className="fs14 fontRegular codGray600">{tertiaryText}</p>
      )}
    </div>
  );
};

export default OrderPreviewListItemText;
