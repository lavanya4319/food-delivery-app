import "./CategorySection.css";

const categories = [
  { id: 1, name: "Pizza", icon: "🍕" },
  { id: 2, name: "Burger", icon: "🍔" },
  { id: 3, name: "Biryani", icon: "🍛" },
  { id: 4, name: "Chinese", icon: "🥡" },
  { id: 5, name: "Desserts", icon: "🍰" },
  { id: 6, name: "Drinks", icon: "🥤" },
];

const CategorySection = () => {
  return (
    <section className="category-section">
      <div className="category-container">
        <h2>Browse Categories</h2>

        <div className="category-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.id}>
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;