import { gql } from "@apollo/client";
export const ADMIN_LOGIN = gql`
  mutation admin_login($password: String!, $username: String!) {
    AdminLogIn(password: $password, username: $username) {
      accessToken
      error
      message
    }
  }
`;

//get admin by pk
export const ADMIN_PK = gql`
  query MyQuery($id: String!) {
    admin_by_pk(id: $id) {
      id
      password
      username
      role
    }
  }
`;

//updete admin
export const EDIT_ADMIN = gql`
  mutation MyMutation($id: Int!, $password: String!, $username: String!) {
    update_admin_by_pk(
      pk_columns: { id: $id }
      _set: { password: $password, role: "admin", username: $username }
    ) {
      id
      password
      role
      username
    }
  }
`;
