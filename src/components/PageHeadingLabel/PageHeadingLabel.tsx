import styles from "./PageHeadingLabel.module.css";

interface PageHeadingLabelProps {
  heading: string;
  highlightedWords?: string[];
  subHeading?: string;
  className?: string;
}

const PageHeadingLabel: React.FC<PageHeadingLabelProps> = ({
  heading,
  highlightedWords,
  subHeading,
  className = "",
}) => {
  const renderHeading = () => {
    if (!highlightedWords || highlightedWords.length === 0) {
      return <span className={styles.headingNormal}>{heading}</span>;
    }

    // Create a regex pattern for all highlighted words/phrases
    const regex = new RegExp(`(${highlightedWords.join("|")})`, "gi");
    const parts = heading.split(regex); // Split using regex while keeping matched words

    return parts.map((part, index) => {
      const isHighlighted = highlightedWords.includes(part);
      return (
        <span
          key={index}
          className={
            isHighlighted
              ? `${styles.headingHighlighted} red600`
              : `${styles.headingNormal} codGray950`
          }
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div className={`${styles.headerBox} ${className}`}>
      <h3 className={`${styles.heading} text-capitalize`}>{renderHeading()}</h3>
      {subHeading && <p className={styles.subHeading}>{subHeading}</p>}
    </div>
  );
};

export default PageHeadingLabel;
