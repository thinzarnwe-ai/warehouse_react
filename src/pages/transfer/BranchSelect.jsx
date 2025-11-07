import React from "react";
import Select from "react-select";

export default function BranchSelect({ branches, loadingBranches, selectedBranch, setSelectedBranch }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-primary">
        Branch <span className="text-red-600">*</span>
      </label>
      <Select
        id="branch"
        options={branches}
        value={selectedBranch}
        onChange={setSelectedBranch}
        isLoading={loadingBranches}
        placeholder="Select a branch"
        className="mt-2 text-sm w-full border border-primary"
        classNamePrefix="react-select"
      />
    </div>
  );
}
