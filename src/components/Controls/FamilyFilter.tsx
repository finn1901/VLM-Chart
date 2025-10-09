interface FamilyFilterProps {
  families: string[];
  selectedFamily: string;
  onFamilyChange: (family: string) => void;
}

export const FamilyFilter = ({ families, selectedFamily, onFamilyChange }: FamilyFilterProps) => {
  return (
    <div className="controls">
      <label className="control-label" htmlFor="family-filter">
        Filter by family
      </label>
      <select
        id="family-filter"
        className="family-select"
        value={selectedFamily}
        onChange={(e) => onFamilyChange(e.target.value)}
      >
        {families.map((family) => (
          <option key={family} value={family}>
            {family === 'all' ? 'All families' : family}
          </option>
        ))}
      </select>
    </div>
  );
};
