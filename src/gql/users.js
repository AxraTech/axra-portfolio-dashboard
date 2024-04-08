import { gql } from "@apollo/client";
export const ALL_USERS = gql`
  query MyQuery {
    users(order_by: { updated_at: desc }) {
      background_image_url
      created_at
      disabled
      email
      fcm_token
      id
      name
      otp
      password
      points
      phone
      profile_image_url
      updated_at
    }
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//delete user
export const DELETE_USERS = gql`
  mutation MyMutation($id: Int!) {
    delete_users_by_pk(id: $id) {
      id
    }
  }
`;
