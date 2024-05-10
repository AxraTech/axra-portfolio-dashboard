import { gql } from "@apollo/client";
export const GET_ALL_APPOINMENT_FORM = gql`
  query aa {
    user_appointment_form {
      id
      created_at
      updated_at
      company_name
      descripiton
      date_time
      email
      phone
    }
    user_appointment_form_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get by id
export const APPOINTMENT_BY_PK = gql`
  query aa($id: Int!) {
    user_appointment_form(where: { id: { _eq: $id } }) {
      id
      company_name
      date_time
      email
      phone
      descripiton
      created_at
      updated_at
    }
  }
`;

//delete user appointment
export const DELETE_APPOINTMENT = gql`
  mutation aa($id: Int!) {
    delete_user_appointment_form(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;
