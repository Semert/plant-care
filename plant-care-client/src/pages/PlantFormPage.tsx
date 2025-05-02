import React from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import PlantForm from "../components/plants/PlantForm";

const PlantFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  return (
    <PageContainer title={isEdit ? "Edit Plant" : "Create Plant"}>
      <PlantForm isEdit={isEdit} />
    </PageContainer>
  );
};

export default PlantFormPage;
