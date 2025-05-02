import React from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import HouseholdForm from "../components/households/HouseholdForm";

const HouseholdFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  return (
    <PageContainer title={isEdit ? "Edit Household" : "Create Household"}>
      <HouseholdForm isEdit={isEdit} />
    </PageContainer>
  );
};

export default HouseholdFormPage;
