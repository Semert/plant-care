import React from "react";
import PageContainer from "../components/layout/PageContainer";
import PlantList from "../components/plants/PlantList";

const PlantsPage: React.FC = () => {
  return (
    <PageContainer title="Plants">
      <PlantList />
    </PageContainer>
  );
};

export default PlantsPage;
