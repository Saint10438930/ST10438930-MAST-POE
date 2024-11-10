import React, { useState } from 'react'; 
import { Image,ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Sample dish data for demonstration without images
let sampleDishes = {
  Starters: [
    { name: 'Bruschetta', price: 6, description: 'Toasted bread with tomato and basil.' },
    { name: 'Stuffed Mushrooms', price: 8, description: 'Mushrooms stuffed with cheese and herbs.' },
    { name: 'Caprese Salad', price: 7, description: 'Fresh mozzarella, tomatoes, and basil.' },
  ],
  Mains: [
    { name: 'Grilled Chicken', price: 15, description: 'Chicken grilled to perfection.' },
    { name: 'Beef Steak', price: 18, description: 'Juicy beef steak cooked to order.' },
    { name: 'Vegetarian Lasagna', price: 14, description: 'Lasagna with roasted vegetables.' },
  ],
  Desserts: [
    { name: 'Chocolate Cake', price: 5, description: 'Rich chocolate cake with cream.' },
    { name: 'Tiramisu', price: 6, description: 'Classic Italian coffee-flavored dessert.' },
    { name: 'Cheesecake', price: 7, description: 'Creamy cheesecake with berry topping.' },
  ],
};

// Initialize menu with sample data
let menu = JSON.parse(JSON.stringify(sampleDishes));

const Stack = createStackNavigator();

type DishType = {
  name: string;
  price: number;
  description: string;
};

type MenuType = {
  [course: string]: DishType[];
};

// Utility functions
const calculateTotalItems = (dishes: MenuType) => {
  let totalItems = 0;
  for (const course in dishes) {
    totalItems += dishes[course].length;
  }
  return totalItems;
};

const calculateAveragePrices = (dishes: MenuType) => {
  let averages: {[course: string]: string} = {};
  for (const course in dishes) {
    const courseItems = dishes[course];
    if (courseItems.length === 0) {
      averages[course] = "0.00";
    } else {
      let total = courseItems.reduce((sum, dish) => sum + dish.price, 0);
      averages[course] = (total / courseItems.length).toFixed(2);
    }
  }
  return averages;
};

// Home Screen Component
const HomeScreen = ({ navigation }) => {
  const totalItems = calculateTotalItems(menu);
  const averagePrices = calculateAveragePrices(menu);

  return (
    <ScrollView style={styles.container}>
      <View style ={styles.logoContainer}>
        <Image source={require('./assets/Logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.heading}>Chef Christoffel</Text>
      
      {/* Display total items */}
      <Text style={styles.totalItems}>Total Menu Items: {totalItems}</Text>
      
      {/* Display average prices by course */}
      <View style={styles.averagePricesContainer}>
        <Text style={styles.subheading}>Average Prices by Course:</Text>
        {Object.keys(averagePrices).map((course, index) => (
          <Text key={index} style={styles.averagePrice}>
            {course}: ${averagePrices[course]}
          </Text>
        ))}
      </View>

      {/* Navigation buttons */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('MenuScreen')}
      >
        <Text style={styles.buttonText}>View Complete Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('ManageMenuScreen')}
      >
        <Text style={styles.buttonText}>Manage Menu Items</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('FilterScreen')}
      >
        <Text style={styles.buttonText}>Filter by Course</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Complete Menu Screen Component
const MenuScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Complete Menu</Text>
      {Object.keys(menu).map((course, index) => (
        <View key={index}>
          <Text style={styles.courseTitle}>{course}</Text>
          {menu[course].map((dish, dishIndex) => (
            <View key={dishIndex} style={styles.dishContainer}>
              <Text style={styles.dishText}>{dish.name} - ${dish.price}</Text>
              <Text style={styles.dishDescription}>{dish.description}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

// Manage Menu Screen Component
const ManageMenuScreen = () => {
  const [newDish, setNewDish] = useState({
    name: '',
    price: '',
    description: '',
    course: 'Starters'
  });

  const addDish = () => {
    if (!newDish.name || !newDish.price || !newDish.description) {
      alert('Please fill in all fields');
      return;
    }

    const dish = {
      name: newDish.name,
      price: parseFloat(newDish.price),
      description: newDish.description,
    };

    menu[newDish.course] = [...menu[newDish.course], dish];
    
    setNewDish({
      name: '',
      price: '',
      description: '',
      course: 'Starters'
    });
    
    alert('Dish added successfully!');
  };

  const removeDish = (course: string, index: number) => {
    menu[course].splice(index, 1);
    alert('Dish removed successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add New Menu Item</Text>
      
      <TextInput
        placeholder="Dish Name"
        value={newDish.name}
        onChangeText={(text) => setNewDish({ ...newDish, name: text })}
        style={styles.input}
        placeholderTextColor="#666"
      />
      
      <TextInput
        placeholder="Price"
        value={newDish.price}
        onChangeText={(text) => setNewDish({ ...newDish, price: text })}
        keyboardType="decimal-pad"
        style={styles.input}
        placeholderTextColor="#666"
      />
      
      <TextInput
        placeholder="Description"
        value={newDish.description}
        onChangeText={(text) => setNewDish({ ...newDish, description: text })}
        style={styles.input}
        placeholderTextColor="#666"
        multiline
      />

      {/* Course Selection */}
      <View style={styles.pickerContainer}>
        {Object.keys(menu).map((course, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.courseButton,
              newDish.course === course && styles.courseButtonSelected
            ]}
            onPress={() => setNewDish({ ...newDish, course })}
          >
            <Text style={styles.courseButtonText}>{course}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={addDish}>
        <Text style={styles.buttonText}>Add Dish</Text>
      </TouchableOpacity>

      {/* Remove Items Section */}
      <Text style={styles.heading}>Remove Menu Items</Text>
      {Object.keys(menu).map((course, index) => (
        <View key={index}>
          <Text style={styles.courseTitle}>{course}</Text>
          {menu[course].map((dish, dishIndex) => (
            <View key={dishIndex} style={styles.dishContainer}>
              <Text style={styles.dishText}>{dish.name} - ${dish.price}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeDish(course, dishIndex)}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

// Filter Screen Component
const FilterScreen = () => {
  const [selectedCourse, setSelectedCourse] = useState('Starters');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Filter by Course</Text>
      
      <View style={styles.filterButtons}>
        {Object.keys(menu).map((course, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.courseButton,
              selectedCourse === course && styles.courseButtonSelected
            ]}
            onPress={() => setSelectedCourse(course)}
          >
            <Text style={styles.courseButtonText}>{course}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <Text style={styles.selectedCourse}>Selected: {selectedCourse}</Text>
        {menu[selectedCourse].map((dish, index) => (
          <View key={index} style={styles.dishContainer}>
            <Text style={styles.dishText}>{dish.name} - ${dish.price}</Text>
            <Text style={styles.dishDescription}>{dish.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// App Component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} />
        <Stack.Screen name="ManageMenuScreen" component={ManageMenuScreen} />
        <Stack.Screen name="FilterScreen" component={FilterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#2e2e2e' 
  },
  heading: { 
    fontSize: 24, 
    color: '#fff', 
    marginVertical: 16 
  },
  subheading: { 
    fontSize: 18, 
    color: '#ccc' 
  },
  totalItems: { 
    color: '#aaa', 
    fontSize: 16, 
    marginVertical: 8 
  },
  averagePricesContainer: { 
    marginBottom: 16 
  },
  averagePrice: { color: '#aaa', 
    fontSize: 16, 
    marginTop: 4 
  },
  input: { backgroundColor: '#555', 
    color: '#fff', 
    padding: 12, 
    marginVertical: 8 
  },
  button: { 
    backgroundColor: '#4e7bdc', 
    padding: 12, 
    marginVertical: 8 
  },
  buttonText: { color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  courseTitle: { fontSize: 20, 
    color: '#f1c40f', 
    marginTop: 16 
  },
  dishContainer: { 
    paddingVertical: 8 
  },
  dishText: { 
    color: '#eee', 
    fontSize: 16 
  },
  dishDescription: { color: '#bbb', 
    fontSize: 14, 
    marginTop: 4 
  },
  removeButton: { 
    backgroundColor: '#e74c3c', 
    padding: 6, 
    marginTop: 8 
  },
  filterButtons: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginVertical: 8 
  },
  courseButton: { backgroundColor: '#555', 
    padding: 8, 
    margin: 4 
  },
  courseButtonSelected: { 
    backgroundColor: '#4e7bdc' 
  },
  courseButtonText: { 
    color: '#fff', 
    fontSize: 14 
  },
  selectedCourse: { 
    color: '#f1c40f', 
    fontSize: 18, 
    marginVertical: 12 
  },
  logoContainer: { 
    alignItems: 'flex-end', 
    marginBottom: 20 
  },
  logo: { 
    width: 35, 
    height: 35 },
});

export default App;
