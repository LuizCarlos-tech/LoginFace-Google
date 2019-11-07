module.exports = (sequelize, DataTypes) => {
    const Microorganism = sequelize.define('microorganisms', {
      name: DataTypes.STRING,
      id_category: DataTypes.INTEGER,
    });

    Microorganism.associate = models => {
      
        Microorganism.hasMany(models.foods_micros,{
          foreignKey :'id_micro',
          as:'foods_micro'
      });
    }
  return Microorganism;
}