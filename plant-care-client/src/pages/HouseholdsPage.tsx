import React from "react";
import PageContainer from "../components/layout/PageContainer";
import HouseholdList from "../components/households/HouseholdList";

const HouseholdsPage: React.FC = () => {
  return (
    <PageContainer title="Households">
      <HouseholdList />
    </PageContainer>
  );
};

export default HouseholdsPage;
