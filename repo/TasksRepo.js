const Tasks = require("../Schema/Tasks");

//basic data of tasks account
const data = {
  //this data will change when fetch api
  tasks: {},
  //this data will change when fetch api
  columns: {
    monday: { tasksToDo: [] },
    tuesday: { tasksToDo: [] },
    wednesday: { tasksToDo: [] },
    thursday: { tasksToDo: [] },
    friday: {
      tasksToDo: [],
    },
    satuday: { tasksToDo: [] },
    sunday: { tasksToDo: [] },
    store: { tasksToDo: [] },
  },
  columnsId: [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "satuday",
    "store",
  ],
};
//repository tasks
const TaskRepo = {
  modifiedData: function (data) {
    let modified = {};
    data.forEach((element) => {
      modified[element.name] = element.value;
    });
    return modified;
  },
  revertModifiedData: function (data) {
    let entries = Object.entries(data);
    return entries.map((element) => {
      return {
        name: element[0],
        value: element[1],
      };
    });
  },
  //return account data base on given id
  getTasks: function (id, resolve, reject) {
    console.log(id);
    if (id)
      Tasks.findById(id)
        .then((data) => {
          data = data.toObject();
          data.columns = TaskRepo.modifiedData(data.columns);
          data.tasks = TaskRepo.modifiedData(data.tasks);
          resolve(data);
        })
        .catch((err) => reject(err));
    else resolve("");
  },
  //return true or false to show update is success or not
  updateTasks: function (id, nameTask, newData, resolve, reject) {
    Tasks.updateOne(
      { _id: id, "tasks.name": nameTask },
      {
        $set: {
          lastUpdate: Date.now(),
          "tasks.$.value.hoursRemain": newData.hoursRemain,
          "tasks.$.value.minutesRemain": newData.minutesRemain,
          "tasks.$.value.secondsRemain": newData.secondsRemain,
        },
      }
    )
      .then(() => resolve(true))
      .catch((err) => {
        reject(err);
      });
  },
  //return true or false to show update is success or not
  updateAll: function (id, newData, resolve, reject) {
    console.log(id);
    console.log(newData.tasks);
    console.log(newData.columns);
    Tasks.updateOne(
      { _id: id },
      {
        $set: {
          lastUpdate: Date.now(),
          tasks: TaskRepo.revertModifiedData(newData.tasks),
          columns: TaskRepo.revertModifiedData(newData.columns),
        },
      }
    )
      .then(() => resolve(true))
      .catch((err) => {
        reject(err);
      });
  },
  //return the id of the new task insert
  insertNewTasks: function (resolve, reject) {
    const task = new Tasks({
      lastUpdate: Date.now(),
      tasks: TaskRepo.revertModifiedData(data.tasks),
      columns: TaskRepo.revertModifiedData(data.columns),
      columnsId: data.columnsId,
    });
    task
      .save()
      .then((result) => {
        resolve(result._id);
      })
      .catch((err) => {
        reject(err);
      });
  },
};

module.exports = TaskRepo;
