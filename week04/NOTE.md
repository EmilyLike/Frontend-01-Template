# 每周总结可以写在这里
#### JS Context => Realm
Realm是js引擎中最大粒度的一个东西，对应一个global object，realm里有一套完整的内置对象，多个不同的realm他们之间，object对象，array对象，date对象，promise属性对应的原型，每个realm都会创建一整套完整的内置属性。  
在JS中，函数表达式和对象直接量均会创建对象。  
使用 . 做隐式转换也会创建对象。  
这些对象也是有原型的，如果我们没有Realm，就不知道它们的原型是什么。  

#### Execution Context
Execution Context Stack 包含多个Execution context，包含以下字段：
  - Code Evaluation state
  - Function
  - Script or Module
  - Generator(只有generator才有这个属性)
  - Realm
  - Lexical Environment(this,new.target,super,变量)
  - Variable Environment(历史遗留包袱，仅仅用于处理var声明)
  
  ##### Environment Records
  - Declarative Environment Records
    - Function Environment Records
    - Module Environment Records
 - Global Environment Records
 - Object Environment Records
 
 ##### Function - Closure
 - Environment Records
 - Code
