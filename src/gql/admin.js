import { gql } from "@apollo/client";
export const ADMIN_LOGIN = gql`
  mutation admin_login(
    $password: String!
    $role: String!
    $phone: String!
    $username: String!
  ) {
    AdminLogIn(
      password: $password
      phone: $phone
      role: $role
      username: $username
    ) {
      accessToken
      error
      message
    }
  }
`;
