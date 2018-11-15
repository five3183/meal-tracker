// STORAGE CONTROLLER
const StorageCtrl = (() => {
   return {
      storeItem: (item) => {
         let items

         // Check to see if there are anyitems in localstorage
         if(localStorage.getItem('items') === null) {
            items = []
            items.push(item)

            localStorage.setItem('items', JSON.stringify(items))
         } else {
            // Get items to localstorage so we can add to it. 
            items = JSON.parse(localStorage.getItem('items'))

            // Push new item in items
            items.push(item)

            //Set localstorage with updated array
            localStorage.setItem('items', JSON.stringify(items))
         }
      },
      getItems: () => {
         let items
         if(localStorage.getItem('items') === null) {
            items = []
            localStorage.setItem('items', JSON.stringify([]))
         } else {
            // Get items to localstorage so we can add to it. 
            items = JSON.parse(localStorage.getItem('items'))
         }
         return items
      },
      updateItemStorage: (updatedItem) => {
         let items = StorageCtrl.getItems('items')
         items.forEach((item, index) => {
            if(updatedItem.id === item.id) {
               items.splice(index, 1, updatedItem)
            }
         })
         localStorage.setItem('items', JSON.stringify(items))
      },
      deleteItemFromStorage: (id) => {
         let items = StorageCtrl.getItems('items')

         items.forEach((item, index) => {
            if(id === item.id) {
               items.splice(index, 1)
            }
         })
         localStorage.setItem('items', JSON.stringify(items))
      },
      clearAllStorage: () => {
         localStorage.removeItem('items')
      }
   }
})()

// ITEM CONTROLLER
const ItemCtrl = (() => {
   // ITEM ELEMENTS

   // ITEM CONTSTUCTOR
   class Item {
      constructor(id, name, calories) {
         this.id = id
         this.name = name
         this.calories = calories
      }      
   }
   // DATA STRUCTURE (state)
   const data = {
      items: StorageCtrl.getItems(),
      currentItem: null,
      totalCalories: 0
   }

   return {

      //Public method
      getItems: () => {
         return data.items
      },
      getItemById: (ID) => {
         let found = null
         data.items.forEach(item => {
            if(item.id === ID) {
               found = item
            }
         })
         return found
      },
      addItem: (name, calories) => {
         let ID
         // Create ID
         if(data.items.length > 0) {
            ID = data.items[data.items.length - 1].id + 1
         } else {
            ID = 0
         }
         // Calories to number
         calories = parseInt(calories)

         // Create new item
         newItem = new Item(ID, name, calories)

         // Add new item to data array and return new item
         data.items.push(newItem)

         return newItem
      },
      updateItem: (input) => {
         calories = parseInt(input.calories)
         name = input.name

         let found = null
         data.items.forEach(item => {
            if(item.id === data.currentItem.id) {
               item.name = name
               item.calories = calories
               found = item
            }
         })
         return found
      },
      deleteItem: (id) => {
         const ids = data.items.map(item => {
            return item.id
         })

         //Get index
         const index = ids.indexOf(id)

         //Remove item from array
         data.items.splice(index, 1)

         // StorageCtrl.deleteItem(id)
      },
      clearList: () => {
         data.items =[]
      },
      setCurrentItem: (item) => {
         data.currentItem = item
      },
      getCurrentItem: () => {
         return data.currentItem
      },
      getTotalCalories: () => {
         const items = ItemCtrl.getItems()
         let total = 0

        items.forEach(item => {
            total += item.calories
         })

         data.totalCalories = total

         return data.totalCalories
      },
      logData: () => {
         return data
      }
   }
})()


// UI CONTROLLER
const UICtrl = (() => {
   //UI ELEMENTS
   const UIElements = {
      itemList: document.getElementById('item-list'),
      itemNameInput: document.getElementById('item-name'),
      itemCalorieInput: document.getElementById('item-calorie'),
      allListItems: '.collection-item',
      calorieHead: document.getElementById('calorie-head'),
      displayCalories: document.getElementById('total-calories'),
      addBtn: document.getElementById('add-btn'),
      updateBtn: document.getElementById('update-btn'),
      deleteBtn: document.getElementById('delete-btn'),
      clearBtn: document.getElementById('clear-btn'),
      backBtn: document.getElementById('back-btn')
   }
   
   //Public methods
   return {
      populateItemList: (items) => {
         let html = ''
         items.forEach(item => {
            html += `
               <li id="item-${item.id}" class="collection-item">
                  <strong>${item.name}: </strong>
                  <em>Calories ${item.calories}</em>
                  <a href="#" class="secondary-content">
                     <i class="edit-item fa fa-pencil"></i>
                  </a>
               </li>
            `
         })
         
         //Insert list items
         UIElements.itemList.innerHTML = html
      },
      getItemInput: () => {
         return {
            name: UIElements.itemNameInput.value,
            calories: UIElements.itemCalorieInput.value
         }
      },
      // The following method is not needed if we return the data.items from addItem and call populateItemList.
      addListItem: (item) => {
         // Create li element
         const li = document.createElement('li')
         // Add display block to unhide the element
         UIElements.itemList.style.display = 'block'
         // Add class
         li.className = 'collection-item'
         // Add ID
         li.id = `item-${item.id}`

         // Add HTML
         li.innerHTML = `
            <strong>${item.name}: </strong>
            <em>Calories ${item.calories}</em>
            <a href="#" class="secondary-content">
               <i class="edit-item fa fa-pencil"></i>
            </a>
         `

         // Insert item
         UIElements.itemList.insertAdjacentElement('beforeend', li)

      },
      updateListItem: (item) => {
         let elementList = document.querySelectorAll(UIElements.allListItems)

         elementList.forEach(element => {
            const itemID = element.getAttribute('id')

            if(itemID === `item-${item.id}`) {
               document.querySelector(`#item-${item.id}`).innerHTML = `
               <strong>${item.name}: </strong>
               <em>Calories: ${item.calories}</em>
               <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
               </a>
               `
            }
         })
      },
      deleteListItem: (id) => {
         const itemID = `#item-${id}`
         const item = document.querySelector(itemID)
         item.remove()
      },
      clearListItems: () => {
         const listItems = UIElements.itemList
         listItems.innerHTML = ``
         
      },
      clearInput: () => {
         UIElements.itemNameInput.value = ''
         UIElements.itemCalorieInput.value = ''
      },
      addItemToForm: () => {
         UICtrl.showEditState()
      },
      hideList: () => {
         UIElements.itemList.style.display = 'none'
      },
      showTotalCalories: (totalCalories) => {
         UICtrl.getSelectors().UIElements.calorieHead.style.display = 'block'
         UIElements.displayCalories.textContent = totalCalories
      },
      clearEditState: () => {
         UICtrl.clearInput()
         UICtrl.getSelectors().UIElements.updateBtn.style.display = 'none'
         UICtrl.getSelectors().UIElements.deleteBtn.style.display = 'none'
         UICtrl.getSelectors().UIElements.backBtn.style.display = 'none'
         UICtrl.getSelectors().UIElements.addBtn.style.display = 'inline'
      },
      showEditState: () => {
         UIElements.itemNameInput.value = ItemCtrl.getCurrentItem().name
         UIElements.itemCalorieInput.value = ItemCtrl.getCurrentItem().calories
         UICtrl.getSelectors().UIElements.updateBtn.style.display = 'inline'
         UICtrl.getSelectors().UIElements.deleteBtn.style.display = 'inline'
         UICtrl.getSelectors().UIElements.backBtn.style.display = 'inline'
         UICtrl.getSelectors().UIElements.addBtn.style.display = 'none'
      },
      getSelectors: () => {
         return {
            UIElements
         }
      }
   }
})()


// APP CONTROLLER
const App = ((ItemCtrl, StorageCtrl, UICtrl) => {

   // Load event listeners
   const loadEventListeners = () => {
      const UISelectors = UICtrl.getSelectors()

      //Add item event
      UISelectors.UIElements.addBtn.addEventListener('click', addItemClick)

      // Disable submit on enter
      document.addEventListener('keypress', (e) => {
         if(e.keyCode === 13 || e.which === 13) {
            e.preventDefault()
            return false
         }
      })
      // Edit icon click event
      UISelectors.UIElements.itemList.addEventListener('click', editItemClick)

      // Update item
      UISelectors.UIElements.updateBtn.addEventListener('click', updateItemClick)

      // Back button 
      UISelectors.UIElements.backBtn.addEventListener('click', (e) => {
         UICtrl.clearEditState()
         e.preventDefault()
      })

      // Delete item
      UISelectors.UIElements.deleteBtn.addEventListener('click', deleteItemClick)

      //Clear all btn
      UISelectors.UIElements.clearBtn.addEventListener('click', clearListClick)
   }
   // Add item submit
   const addItemClick = (e) => {
      // Get form input from UI controller
      const input = UICtrl.getItemInput()

      // Check for user input in the fields
      if(input.name !== '' && input.calories !== '') {
         // Add item
         const newItem = ItemCtrl.addItem(input.name, input.calories)

         // Add item to list
         UICtrl.addListItem(newItem)

         // Get total calories
         const totalCalories = ItemCtrl.getTotalCalories()
        
         // Set the total calorie inner text equal to totalCalories
         UICtrl.showTotalCalories(totalCalories)

         StorageCtrl.storeItem(newItem)


         // Clear input fields
         UICtrl.clearInput()
      }

      e.preventDefault()
   }
   // The item does not exist at the time of load.  Event delgation must be used!
   const editItemClick = (e) => {
      if(e.target.classList.contains('edit-item')) {
         // Get element ID
         const listID = e.target.parentNode.parentNode.id
         
         // Split listID into an array to target data
         const arrayID = listID.split('-')
         const ID = parseInt(arrayID[1])

         const itemToEdit = ItemCtrl.getItemById(ID)

         // Set current item
         ItemCtrl.setCurrentItem(itemToEdit)

         // Add item to form
         UICtrl.addItemToForm()
      }
      e.preventDefault()
   } 
   const updateItemClick = (e) => {
      // Get item input
      const input = UICtrl.getItemInput()

      //Update item
      const updatedItem = ItemCtrl.updateItem(input)
      UICtrl.updateListItem(updatedItem)

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()
        
      // Set the total calorie inner text equal to totalCalories
      UICtrl.showTotalCalories(totalCalories)

      UICtrl.clearEditState()

      // Update localstorage
      StorageCtrl.updateItemStorage(updatedItem)

      e.preventDefault()
   }
   const deleteItemClick = (e) => {
      const currentItem = ItemCtrl.getCurrentItem()

      // Delete from data structure
      ItemCtrl.deleteItem(currentItem.id)

      // Delete from UI
      UICtrl.deleteListItem(currentItem.id)

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()
      
      // Set the total calorie inner text equal to totalCalories
      UICtrl.showTotalCalories(totalCalories)

      // Delete item from local storage
      StorageCtrl.deleteItemFromStorage(currentItem.id)

      UICtrl.clearEditState()

      e.preventDefault()
   }
   
   const clearListClick = (e) => {
      
      // Delete currentItems
      ItemCtrl.clearList()

      // Clear list from UI
      UICtrl.clearListItems()

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()
      
      // Set the total calorie inner text equal to totalCalories
      UICtrl.showTotalCalories(totalCalories)

      UICtrl.clearEditState()

      // Check to see if total calorie list should be hidden
      const calorieValue = parseInt(UICtrl.getSelectors().UIElements.displayCalories.textContent)
      if(calorieValue === 0) {
         UICtrl.getSelectors().UIElements.calorieHead.style.display = 'none'
      } else {
         UICtrl.getSelectors().UIElements.calorieHead.style.display = 'block'
      }

      // Delete all of local storage
      StorageCtrl.clearAllStorage()

      // Hide empty ul
      UICtrl.hideList()

      e.preventDefault()
   }

   // Public methods
   return {
      init: () => {
         // Clear edit state
         UICtrl.clearEditState()
         //Fetch items from data structure
         const items = ItemCtrl.getItems()

         // Check to see if list should be hidden
         if(items.length === 0) {
            UICtrl.hideList()
         } else {
            //Populate list with items
            UICtrl.populateItemList(items)
         }

          // Get total calories
          const totalCalories = ItemCtrl.getTotalCalories()
   
          // Set the total calorie inner text equal to totalCalories
          UICtrl.showTotalCalories(totalCalories)

          // Check to see if total calorie list should be hidden
         const calorieValue = parseInt(UICtrl.getSelectors().UIElements.displayCalories.textContent)
         if(calorieValue === 0) {
            UICtrl.getSelectors().UIElements.calorieHead.style.display = 'none'
         } else {
            UICtrl.getSelectors().UIElements.calorieHead.style.display = 'block'
         }
         
         //Load event listeners
         loadEventListeners()
      }
   }

})(ItemCtrl, StorageCtrl, UICtrl)

App.init()