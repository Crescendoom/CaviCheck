function ContentCard({ iconSrc, iconAlt, description }) {
  return (
    <article className="content-card">
      <figure className="content-icon">
        <img src={iconSrc} alt={iconAlt} />
      </figure>
      <p className="content-description">{description}</p>
    </article>
  );
}

export default ContentCard;