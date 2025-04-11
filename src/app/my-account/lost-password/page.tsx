"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { ApolloProvider } from "@apollo/client";
import client from "../../../lib/apolloClient";
import ResetPasswordForm from "@/components/ResetPasswordForm";

const ResetPasswordFormPage = () => {
  return (
    <ApolloProvider client={client}>
      {" "}
      <ResetPasswordForm />{" "}
    </ApolloProvider>
  );
};

export default ResetPasswordFormPage;
