import React, { useState } from "react";
import { styled, Card as FPCard, Image, Button, Paragraph } from "fannypack";
import { useHomePageContext } from "../../pages/HomePage/HomePageContext";
import { Link } from "react-router-dom";

const CardItem = styled(FPCard.Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 0.7rem;
`;

const ImageStyled = styled(Image)`
  max-width: 100%;
  max-height: 160px;
  @media (min-width: 1020px) {
    max-width: 180px;
  }
`;

const SingleImageStyled = styled(Image)`
  max-width: 100%;
  max-height: 400px;
  margin-right: 0.5rem;
`;

const CardCta = styled(Button)`
  padding: 0 0.5rem;
  margin: 0 0.5rem;
  border: 1px solid;
  border-radius: 0.25rem;
  text-align: center;
  width: 80%;
  font-size: 0.88rem;
  font-weight: 500;
  color: #041e42;
  background-color: #ffcc00;
  border-width: 0;
  white-space: nowrap;

  &:hover {
    background-color: #ffcc00;
  }
  &:active {
    background-color: #ffcc00;
    transform: translateY(3px);
  }
`;

const CardLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
  margin: 0 0.5rem;
  border: 1px solid;
  border-radius: 0.25rem;
  text-align: center;
  width: 80%;
  font-size: 0.88rem;
  font-weight: 500;
  color: #041e42;
  border-width: 0;

  &:hover {
    color: #041e42;
    background-color: #ffcc00;
  }
  &:active {
    color: #041e42;
    background-color: #ffcc00;
    transform: translateY(3px);
  }
`;
const CardAnchor = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
  margin: 0 0.5rem;
  border: 1px solid;
  border-radius: 0.25rem;
  text-align: center;
  width: 80%;
  font-size: 0.88rem;
  font-weight: 500;
  color: #041e42;
  border-width: 0;

  &:hover {
    color: #041e42;
    background-color: #ffcc00;
  }
  &:active {
    color: #041e42;
    background-color: #ffcc00;
    transform: translateY(3px);
  }
`;

const ParagraphStyled = styled(Paragraph)`
  white-space: pre-line;
`;

interface CardProps {
  productId: string;
  name: string;
  description?: string;
  linkImage: string;
  attachmentPath?: string;
  hasPrintCTA?: boolean;
  isSinglePage?: boolean;
}

const ImgWithFallback: React.FunctionComponent<{
  src: string;
  alt: string;
  isSinglePage?: boolean;
}> = ({ src, alt, isSinglePage }) => {
  const [isUndefined, updateIsUndefined] = useState(false);

  const onError = () => {
    updateIsUndefined(true);
  };

  if (isUndefined) {
    return (
      <img
        src="https://product-catalog.sfo2.cdn.digitaloceanspaces.com/products/noimagen.jpg"
        alt={alt}
        title={alt}
      />
    );
  }

  return isSinglePage ? (
    <SingleImageStyled src={src} alt={alt} title={alt} onError={onError} />
  ) : (
    <ImageStyled src={src} alt={alt} title={alt} onError={onError} />
  );
};

const Card: React.FunctionComponent<CardProps> = ({
  productId,
  name,
  description,
  linkImage,
  attachmentPath,
  hasPrintCTA,
  isSinglePage,
}): JSX.Element => {
  const { addCartItem } = useHomePageContext();
  console.log("attachmentPath >>>>>", attachmentPath);
  console.log("isSinglePage >>>", isSinglePage);

  return (
    <CardItem a11yDescriptionId="description" a11yTitleId="title">
      <FPCard.Header>
        <FPCard.Title
          id="title"
          use="h3"
          fontSize="1.1rem"
          fontWeight="500"
          textTransform="capitalize"
        >
          {name}
        </FPCard.Title>
      </FPCard.Header>
      <FPCard.Content
        id="description"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImgWithFallback
          src={linkImage}
          alt={`ver producto: ${name}`}
          isSinglePage={isSinglePage}
        />
        {description && <ParagraphStyled>{description}</ParagraphStyled>}
      </FPCard.Content>

      <FPCard.Footer justifyContent="center">
        {isSinglePage ? (
          <>
            <CardLink to={`/certificaciones`}>Certificado</CardLink>
            {attachmentPath && (
              <CardAnchor
                href={`https://product-catalog.sfo2.cdn.digitaloceanspaces.com/adjuntos/${attachmentPath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargar ficha técnica
              </CardAnchor>
            )}
          </>
        ) : (
          <CardLink to={`/producto/${productId}`}>ver producto</CardLink>
        )}
        <CardCta
          onClick={() =>
            addCartItem({
              productId,
              productName: name,
              productImage: linkImage,
              quantity: 1,
            })
          }
          aria-label={`Cotizar ${name}`}
        >
          Añadir a cotización
        </CardCta>
      </FPCard.Footer>
    </CardItem>
  );
};

export default Card;
