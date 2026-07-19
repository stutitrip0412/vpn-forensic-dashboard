import { useEffect, useState } from "react";

import CasesHeader from "../../components/cases/CasesHeader";
import CaseFilters from "../../components/cases/CaseFilters";
import CaseCard from "../../components/cases/CaseCard";
import EmptyCases from "../../components/cases/EmptyCases";
import CreateCaseModal from "../../components/cases/CreateCaseModal";
import { fetchCases } from "../../services/case.service";

const CasesPage = () => {

  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {

    let data = [...cases];

    if (status !== "All") {
      data = data.filter(
        (item) =>
          item.status?.toLowerCase() === status.toLowerCase()
      );
    }

    if (search.trim()) {

      const q = search.toLowerCase();

      data = data.filter(
  (item) =>
    item.name?.toLowerCase().includes(q) ||
    item.title?.toLowerCase().includes(q) ||
    item.caseName?.toLowerCase().includes(q) ||
    item.description?.toLowerCase().includes(q)
);

    }

    setFilteredCases(data);

  }, [cases, search, status]);

  const loadCases = async () => {

    try {

      const data = await fetchCases();

      setCases(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="space-y-6">

      <CasesHeader   onCreate={() => setOpenModal(true)} />

      <CaseFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {loading ? (

        <div className="text-center py-20">

          Loading Investigation Cases...

        </div>

      ) : filteredCases.length === 0 ? (

        <EmptyCases />

      ) : (

        <div className="grid gap-5">

          {filteredCases.map((item) => (

            <CaseCard
              key={item._id}
              data={item}
            />

          ))}

        </div>

      )}

      <CreateCaseModal
    open={openModal}
    onClose={() => setOpenModal(false)}
    onCreated={loadCases}
/>

    </div>

  );

};

export default CasesPage;