# 每周总结可以写在这里
>找出 JavaScript 标准里所有的对象，分析有哪些对象是我们无法实现出来的，这些对象都有哪些特性？
-Array的length属性根据最大的下标自动发生变化。
-Bind后的function跟原来函数相关联。
-String:为支持下标运算符，string的正整数属性访问会去字符串里查找。
-Arguments：arguments的非负整数型下标属性跟对应的变量联动。
-Object.prototype：作为所有正常对象的默认原型，不能再给她设置原型了。
-模块的namespace对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于import。
