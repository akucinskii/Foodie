import Img from "next/image";
import React from "react";

type Props = {
  setImage: (value: string) => void;
  image?: string;
};

async function isBase64UrlImage(base64String: string) {
  const image = new Image();
  image.src = base64String;
  return await new Promise((resolve) => {
    image.onload = function () {
      if (image.height === 0 || image.width === 0) {
        resolve(false);
        return;
      }
      resolve(true);
    };
    image.onerror = () => {
      resolve(false);
    };
  });
}

const ImageUpload = ({ setImage, image }: Props) => {
  const sendFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // get image from upload input
      const file = e.target.files[0];
      // convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64 = reader.result;
        if (base64) {
          isBase64UrlImage(base64.toString()).then((isImage) => {
            if (isImage) {
              setImage(base64.toString());
            } else {
              alert("Please upload an image");
            }
          });
        }
      };
    }
  };

  return (
    <div className="flex flex-col p-2">
      <div className={`relative ${image && "aspect-square"} h-full w-full`}>
        {image && (
          <Img src={image} alt="uploaded image" className="object-cover" fill />
        )}
      </div>
      <input type="file" accept="image/*" onChange={sendFile} />
    </div>
  );
};

export default ImageUpload;
