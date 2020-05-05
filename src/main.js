// const api = jQuery('.test') //返回的不是元素，而是对象
// api.addClass('red')
//     .addClass('blue')
//     .addClass('yellow')
//向遍历的所有对象里添加.red,.blue,.yellow
//this就是api
//const api1 = jQuery(".test"); //返回的不是元素，而是对象
// api1.addClass('blue')
// const api2 = jQuery('.test').find('.child').addClass('.red')
//api1.addClass("green");
//jQuery('.test').children().print()
// let $div = jQuery('<div>创建div</div>')
// $div.appendTo(document.body)
jQuery(".test")
    .find(".child")
    .addClass(".red")
    .addClass(".blue")
    .addClass("yellow")
    .end()
    .addClass("green2"); //作用于test上