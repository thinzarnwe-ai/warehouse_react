import React from "react";
import Select from "react-select";

export default function BranchSelect({
  branches,
  selectedBranch,
  setSelectedBranch,
  loading,
}) {
  return (
    <div className="col-span-2 relative">
      <label
        htmlFor="branch"
        className="block text-sm font-medium text-primary"
      >
        Branch <span className="text-red-600">*</span>
      </label>
      <div className="mt-2">
        <Select
          id="branch"
          name="branch_name"
          options={branches}
          value={selectedBranch}
          onChange={setSelectedBranch}
          isLoading={loading}
          placeholder="Select a branch"
          className="text-sm w-full border border-primary"
          classNamePrefix="react-select"
        />
      </div>
    </div>
  );
}
