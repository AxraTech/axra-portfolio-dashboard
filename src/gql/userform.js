import { gql } from "@apollo/client";
export const ALL_USERFORM = gql`
  query MyQuery($search: String!) {
    user_appointment_form(
      where: { phone: { _ilike: $search } }
      order_by: { updated_at: desc }
    ) {
      company_name
      created_at
      date_time
      descripiton
      email
      id
      phone
      updated_at
    }
    user_appointment_form_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get user by pk
export const USER_PK = gql`
  query MyQuery($id: Int!) {
    user_appointment_form(where: { id: { _eq: $id } }) {
      company_name
      created_at
      date_time
      descripiton
      email
      id
      phone
      updated_at
    }
  }
`;

//delete use form
export const DELETE_USERFORM = gql`
  mutation MyMutation($id: Int!) {
    delete_user_appointment_form(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;
