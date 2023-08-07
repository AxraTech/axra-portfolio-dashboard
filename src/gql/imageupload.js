import { gql } from "@apollo/client";
export const IMAGE_UPLOAD = gql`
  mutation MyMutation($contentType: String!) {
    getImageUploadUrl(contentType: $contentType) {
      contentType
      error
      imageName
      imageUploadUrl
      message
    }
  }
`;

export const DELETE_IMAGE = gql`
  mutation delete_image($image_name: String!) {
    deleteImage(imageName: $image_name) {
      error
      message
    }
  }
`;
