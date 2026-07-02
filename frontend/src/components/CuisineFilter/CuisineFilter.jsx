import "./CuisineFilter.css";

const cuisines = [
  "All",
  "Pizza",
  "Burgers",
  "Chicken",
  "Biryani",
  "Chinese",
  "Italian",
  "Fast Food",
];

const CuisineFilter = ({
  selectedCuisine,
  setSelectedCuisine,
}) => {
  return (
    <div className="cuisine-filter">
      {cuisines.map((cuisine) => (
        <button
          key={cuisine}
          className={
            selectedCuisine === cuisine
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() =>
            setSelectedCuisine(cuisine)
          }
        >
          {cuisine}
        </button>
      ))}
    </div>
  );
};

export default CuisineFilter;