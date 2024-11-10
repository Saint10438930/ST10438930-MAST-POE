import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Sample dish data for demonstration
let sampleDishes = {
  Starters: [
    { name: 'Bruschetta', price: 6, description: 'Toasted bread with tomato and basil.', image: require('./assets/dishes/bruschetta.jpg') },
    { name: 'Stuffed Mushrooms', price: 8, description: 'Mushrooms stuffed with cheese and herbs.', image: require('./assets/dishes/stuffed_mushrooms.jpg') },
    { name: 'Caprese Salad', price: 7, description: 'Fresh mozzarella, tomatoes, and basil.', image: require('./assets/dishes/caprese_salad.jpg') },
  ],
  Mains: [
    { name: 'Grilled Chicken', price: 15, description: 'Chicken grilled to perfection.', image: require('./assets/dishes/grilled_chicken.jpg') },
    { name: 'Beef Steak', price: 18, description: 'Juicy beef steak cooked to order.', image: require('./assets/dishes/beef_steak.jpg') },
    { name: 'Vegetarian Lasagna', price: 14, description: 'Lasagna with roasted vegetables.', image: require('./assets/dishes/vegetarian_lasagna.jpg') },
  ],
  Desserts: [
    { name: 'Chocolate Cake', price: 5, description: 'Rich chocolate cake with cream.', image: require('./assets/dishes/chocolate_cake.jpg') },
    { name: 'Tiramisu', price: 6, description: 'Classic Italian coffee-flavored dessert.', image: require('./assets/dishes/tiramisu.jpg') },
    { name: 'Cheesecake', price: 7, description: 'Creamy cheesecake with berry topping.', image: require('./assets/dishes/cheesecake.jpg') },
  ],
};

// Initialize menu with sample data
let menu = JSON.parse(JSON.stringify(sampleDishes));

const Stack = createStackNavigator();

type DishType = {
  name: string;
  price: number;
  description: string;
  image: any;
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
              <Image source={dish.image} style={styles.dishImage} />
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
      image: require('./assets/dishes/default.jpg') // Default image for new dishes
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
            <Image source={dish.image} style={styles.dishImage} />
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
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e1e1e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Digital Menu' }}
        />
        <Stack.Screen 
          name="MenuScreen" 
          component={MenuScreen} 
          options={{ title: 'Full Menu' }}
        />
        <Stack.Screen 
          name="ManageMenuScreen" 
          component={ManageMenuScreen} 
          options={{ title: 'Manage Menu' }}
        />
        <Stack.Screen 
          name="FilterScreen" 
          component={FilterScreen} 
          options={{ title: 'Filter Menu' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'flex-end',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  heading: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 18,
    color: '#ffffff',
    marginVertical: 10,
  },
  totalItems: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 10,
  },
  averagePricesContainer: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  averagePrice: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 5,
  },
  courseTitle: {
    fontSize: 20,
    color: '#ffffff',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  dishContainer: {
    marginBottom: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
  },
  dishImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  dishText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dishDescription: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#ffffff',
    backgroundColor: '#1e1e1e',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#cf6679',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  courseButton: {
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  courseButtonSelected: {
    backgroundColor: '#6200ee',
  },
  courseButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  filterButtons: {
    marginBottom: 20,
  },
  selectedCourse: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 15,
  }
});

export default App;