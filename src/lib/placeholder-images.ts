import placeholderData from './placeholder-images.json';

type PlaceholderImage = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const PlaceHolderImages: PlaceholderImage[] = placeholderData.placeholderImages;

export const getPlaceholderImageById = (id: string) => {
    if (!PlaceHolderImages) {
        return undefined;
    }
    return PlaceHolderImages.find((img) => img.id === id);
};
