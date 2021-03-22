/*==============================
 * Project: demo
 * Description:拖拉拽组件
 * @author:danzizhong
 * Time：2021.03.10
=================================*/

// todo top、left 换成 transform:translate(x,y);
function PlaneDrag(opt) {
	let self = this;
	this.dom = document.getElementById(opt.id);
	this.head = this.dom.children[0];
	this.index = opt.index || 1;
	this.life = true;
	this.opt = opt;
	
	this.W = document.documentElement.clientWidth;
	this.H = document.documentElement.clientHeight;

	this.menuH = 61;
	this.width = opt.width || 150 + Math.ceil(Math.random() * 400);
	this.height = opt.height || 200 + Math.ceil(Math.random() * 400);
	this.top = opt.top || 100 ;
	this.left = opt.left || this.W / 2 - this.width/2 ;

	this.dom.style.cssText = 'width: '+this.width+'px; height: '+this.height+'px; transform: translate('+this.left+'px, '+this.top+'px); z-index:' + this.index;

	this.moveFlag = false;
	this.minW = 150; // 最小宽度100
	this.minH = 200; // 最小高度200

	// 拉大缩小属性
	this.edge = 4; // 左右上下距离边3的时候显示拉大缩小

	this.init();

	window.addEventListener('resize', function(){
		self.W = document.documentElement.clientWidth;
		self.H = document.documentElement.clientHeight;
	}.bind(this), false);

	this.prevTime = 0;
	this.nowTime = 0;

	this.doubleClickFlag = false;

	// this.showTipFlag = opt.showTipFlag || true;
	this.tipW = 84;
	this.tipH = 24;
	return this;
}

PlaneDrag.prototype.init = function() {
	let self = this;

	// 因为 addEventListener 和 removeEventListener 不能传递参数
	self.moveFn = self.move.bind(self);
	self.endFn = self.end.bind(self);
	
	self.head.addEventListener('mousedown', (ev) => {
		// ev.stopPropagation();
		if (this.status != 'null') return;
		this.nowTime = new Date().getTime();

		if (this.nowTime - this.prevTime < 300) {
			//
			this.fullWindow();
			
			return;	
		}

		this.prevTime = this.nowTime;
		this.moveFlag = true;
		this.render1();
		self.start(ev);
		document.documentElement.addEventListener('mousemove', self.moveFn, false);
		document.documentElement.addEventListener('mouseup', self.endFn, false);
	}, false)

	self.sizeFn = self.size.bind(self);
	self.sizeEndFn = self.sizeEnd.bind(self);

	// 处理尺寸大小
	self.dom.addEventListener('mousedown', (ev) => {
		if (this.status == 'null') return;
		this.moveFlag = true;
		this.showTipFlag = true;
		this.ev = ev;
		this.render2();
		self.start(ev);
		document.documentElement.addEventListener('mousemove', self.sizeFn, false);
		document.documentElement.addEventListener('mouseup', self.sizeEndFn, false);
	})

	self.dom.addEventListener('mousemove', self.winMove.bind(self), false);

	// 隐藏菜单
	// this.head.children[0].addEventListener('mousedown', function(ev) {
	// 	ev.stopPropagation()
	// 	this.hide()
	// }.bind(this), false)
}

PlaneDrag.prototype.hide = function() {
	this.life = false;
	this.hideCss = this.dom.style.cssText;
	this.dom.style.cssText = this.hideCss + 'display: none';
}

PlaneDrag.prototype.show = function() {
	this.life = true;
	this.dom.style.cssText = this.hideCss;
}

PlaneDrag.prototype.reset = function() {
	this.fullFlag = false;
	this.width = this.opt.width || 150 + Math.ceil(Math.random() * 400);
	this.height = this.opt.height || 200 + Math.ceil(Math.random() * 400);
	this.top = this.opt.top || 100 ;
	this.left = this.opt.left || this.W / 2 - this.width/2 ;
	this.dom.style.cssText = 'width: '+this.width+'px; height: '+this.height+'px; transform: translate('+this.left+'px, '+this.top+'px); z-index:' + this.index;
}

PlaneDrag.prototype.size = function(ev) {
	// console.log('move2')
	this.ev = ev;
	this.disX = ev.screenX - this.startX;
	this.disY = ev.screenY - this.startY;

	if (this.status.indexOf('right') > -1) {
		// 移动代码
		this.width += this.disX;
	}

	if (this.status.indexOf('left') > -1) {
		this.totalW = this.left + this.width;
		this.left += this.disX;
		this.width -= this.disX;
	}

	if (this.status.indexOf('top') > -1) {
		this.totalH = this.top + this.height;
		this.top += this.disY;
		this.height -= this.disY;
	}

	if (this.status.indexOf('bottom') > -1){
		// 移动代码
		this.height += this.disY;
	} 

	this.startX = ev.screenX;
	this.startY = ev.screenY;
}

PlaneDrag.prototype.sizeEnd = function(ev) {
	let self = this;
	this.moveFlag = false;
	this.showTipFlag = false;
	document.documentElement.removeEventListener('mousemove', self.sizeFn, false);
	document.documentElement.removeEventListener('mouseup', self.sizeEndFn, false);
}

PlaneDrag.prototype.start = function(ev) {
	this.startX = ev.screenX;
	this.startY = ev.screenY;
}

PlaneDrag.prototype.move = function(ev) {
	// console.log('move1')
	// 移动代码
	this.disX = ev.screenX - this.startX;
	this.disY = ev.screenY - this.startY;

	this.top += this.disY;
	this.left += this.disX;

	this.startX = ev.screenX;
	this.startY = ev.screenY;
}

PlaneDrag.prototype.end = function(ev)  {
	let self = this;
	// console.log('up')
	this.moveFlag = false;
	document.documentElement.removeEventListener('mousemove', self.moveFn, false);
	document.documentElement.removeEventListener('mouseup', self.endFn, false);
}

PlaneDrag.prototype.fullWindow = function(ev) {
	if (!this.fullFlag) {
		this.fullFlag = true;
		this.prevW = this.width;
		this.prevH = this.height;
		this.prevL = this.left;
		this.prevT = this.top;

		this.width = this.W;
		this.height = this.H - this.menuH;
		this.top = 0;
		this.left = 0;
		this.dom.style.cssText = '-webkit-transition:all ease .3s 0s; width: '+this.width+'px; height: '+this.height+'px; transform: translate('+this.left+'px, '+this.top+'px); z-index:' + this.index;
	} else {
		this.width = this.prevW;
		this.height = this.prevH;
		this.top = this.prevT;
		this.left = this.prevL;

		this.fullFlag = false;
		this.dom.style.cssText = '-webkit-transition:all ease .3s 0s; width: '+this.width+'px; height: '+this.height+'px; transform: translate('+this.left+'px, '+this.top+'px); z-index:' + this.index;
	}

}

// 给全局窗口监听plane边界事件
PlaneDrag.prototype.winMove = function(ev) {
	if (this.moveFlag) return;
	this.dom.className = 'plane-box';
	let r = this.left + this.width;
	let l = this.left;
	let t = this.top + this.menuH;
	let b = this.top + this.height + this.menuH;

	this.status = 'null';

	if (ev.pageX <= r &&  ev.pageX >= r - this.edge - 7 && ev.pageY >= t &&  ev.pageY <= t + this.edge + 7) {
		this.dom.className = 'plane-box rt-move';
		this.status = 'righttop';
		return false;
	}

	if (ev.pageX >= l && ev.pageX <= l + this.edge + 7 && ev.pageY <= b &&  ev.pageY >= b - this.edge - 7) {
		this.dom.className = 'plane-box lb-move';
		this.status = 'leftbottom';
		return false;
	}

	if (ev.pageX >= l && ev.pageX <= l + this.edge + 7 && ev.pageY >= t &&  ev.pageY <= t + this.edge + 7) {
		this.dom.className = 'plane-box rb-move';
		this.status = 'lefttop';
		return false;
	}

	if (ev.pageX <= r &&  ev.pageX >= r - this.edge - 7 && ev.pageY <= b &&  ev.pageY >= b - this.edge - 7) {
		this.dom.className = 'plane-box rb-move';
		this.status = 'rightbottom';
		return false;
	}

	if (ev.pageX <= r &&  ev.pageX >= r - this.edge) {
		this.dom.className = 'plane-box lr-move';
		this.status = 'right';
		return false;
	}
	if (ev.pageX >= l && ev.pageX <= l + this.edge) {
		this.dom.className = 'plane-box lr-move';
		this.status = 'left';
		return false;
	}
	if (ev.pageY >= t &&  ev.pageY <= t + this.edge) {
		this.dom.className = 'plane-box tb-move';
		this.status = 'top';
		return false;
	}
	if (ev.pageY <= b &&  ev.pageY >= b - this.edge) {
		this.dom.className = 'plane-box tb-move';
		this.status = 'bottom';
		return false;
	}
}

// 设置弹窗层级
PlaneDrag.prototype.setZindex = function(index) {
	this.index = index;
}

// 设置showTips
PlaneDrag.prototype.showTips = function(width, height, left, top) {
	if (this.showTipFlag) {
		if (!window.dragTip) {
			let div = document.createElement('div');
			div.className = 'panel-drag-tips'
			window.dragTip = div;
			div.innerHTML = '<span>0 * 0</span>';
			document.body.appendChild(div);
		} 

		let x = this.ev.clientX;
		let y = this.ev.clientY;


		if (this.status.indexOf('righttop') > -1) {
			x = x + 10;
			y = y - this.tipH - 8 ;

			if (x > this.W - this.tipW) {
				x = left + width - this.tipW - 10;
			} else if ( x < left + this.minW + 10  ){
				x = left + this.minW + 10
			}

			if (y < this.menuH + 2) {
				y = top + this.menuH + 10;
			} else if (y > top + this.menuH - this.tipH - 10) {
				y = top + this.menuH - this.tipH - 10;
			}

			window.dragTip.innerHTML = '<span>'+this.dom.offsetWidth+' * '+this.dom.offsetHeight+'</span>';
			window.dragTip.style.cssText = 'left: '+ x +'px; top: '+y+'px';
			return false;
		}

		if (this.status.indexOf('rightbottom') > -1) {
			x = x + 10;
			y = y + 10;

			if (x > this.W - this.tipW) {
				x = left + width - this.tipW - 10;
			} else if ( x < left + this.minW + 10  ){
				x = left + this.minW + 10
			}

			if (y > this.H - this.tipH) {
				y = top + height + this.menuH - this.tipH - 10;
			} else if ( y < top + this.minH + this.menuH + 6  ){
				y = top + this.minH + this.menuH + 6;
			}

			window.dragTip.innerHTML = '<span>'+this.dom.offsetWidth+' * '+this.dom.offsetHeight+'</span>';
			window.dragTip.style.cssText = 'left: '+ x +'px; top: '+y+'px';
			return false;
		}

		if (this.status.indexOf('lefttop') > -1) {
			x = x - this.tipW -  10;
			y = y - this.tipH - 8 ;

			if (x < 0) {
				x = left + 10;
			} else if (x > left - 10 - this.tipW){
				x = left - 10 - this.tipW;
			}

			if (y < this.menuH + 2) {
				y = top + this.menuH + 10;
			} else if (y > top + this.menuH - this.tipH - 10) {
				y = top + this.menuH - this.tipH - 10;
			}

			window.dragTip.innerHTML = '<span>'+this.dom.offsetWidth+' * '+this.dom.offsetHeight+'</span>';
			window.dragTip.style.cssText = 'left: '+ x +'px; top: '+y+'px';
			return false;
		}

		if (this.status.indexOf('leftbottom') > -1) {
			x = x - this.tipW -  10;
			y = y + 10;

			if (x < 0) {
				x = left + 10;
			} else if (x > left - 10 - this.tipW){
				x = left - 10 - this.tipW;
			}
			
			if (y > this.H - this.tipH) {
				y = top + height + this.menuH - this.tipH - 10;
			} else if ( y < top + this.minH + this.menuH + 6  ){
				y = top + this.minH + this.menuH + 6;
			}

			window.dragTip.innerHTML = '<span>'+this.dom.offsetWidth+' * '+this.dom.offsetHeight+'</span>';
			window.dragTip.style.cssText = 'left: '+ x +'px; top: '+y+'px';
			return false;
		}

		if (this.status.indexOf('right') > -1) {
			x = x + 10;

			if (x > this.W - this.tipW) {
				x = left + width - this.tipW - 10;
			} else if ( x < left + this.minW + 10  ){
				x = left + this.minW + 10
			}

			if ( y < top + this.menuH ) {
				y = top + this.menuH ;
			} else if (y > top + height + this.menuH) {
				y = top + height + this.menuH;
			}

			y = y - this.tipH/2;
		}
	
		if (this.status.indexOf('left') > -1) {
			x = x - this.tipW - 10;

			if (x < 0) {
				x = left + 10;
			} else if (x > left - 10 - this.tipW){
				x = left - 10 - this.tipW;
			}

			if ( y < top + this.menuH ) {
				y = top + this.menuH ;
			} else if (y > top + height + this.menuH) {
				y = top + height + this.menuH;
			}

			y = y - this.tipH/2;
		}
	
		if (this.status.indexOf('top') > -1) {
			y = y - this.tipH - 10;

			if (y < this.menuH) {
				y = top + this.menuH + 10;
			} else if (y > top + this.menuH - this.tipH - 10) {
				y = top + this.menuH - this.tipH - 10;
			}

			if ( x < left ) {
				x = left;
			} else if (x > left + width) {
				x = left + width
			}

			x = x - this.tipW/2;
		}
		
		if (this.status.indexOf('bottom') > -1){
			y = y + 10;
			if (y > this.H - this.tipH) {
				y = top + height + this.menuH - this.tipH - 10;
			} else if ( y < top + this.minH + this.menuH + 6  ){
				y = top + this.minH + this.menuH + 6;
			}

			if ( x < left ) {
				x = left;
			} else if (x > left + width) {
				x = left + width
			}
			x = x - this.tipW/2;
		}

		window.dragTip.innerHTML = '<span>'+this.dom.offsetWidth+' * '+this.dom.offsetHeight+'</span>';
		window.dragTip.style.cssText = 'left: '+ x +'px; top: '+y+'px';
	} else if (window.dragTip){
		document.body.removeChild(window.dragTip);
		window.dragTip = null;
	}
}

// 渲染
PlaneDrag.prototype.render1 = function() {
	if (!this.moveFlag || this.status != 'null') {
		// console.log('渲染1结束');
		this.moveBound1();
		return;
	}
	// console.log('render1');
	this.moveBound1();
	requestAnimationFrame(this.render1.bind(this));
}

PlaneDrag.prototype.render2 = function() {
	if (!this.moveFlag) {
		this.moveBound2();
		// console.log('渲染2结束')
		return;
	}
	// console.log('render2');
	this.moveBound2();
	requestAnimationFrame(this.render2.bind(this));
}

// move1 移动边界
PlaneDrag.prototype.moveBound1 = function() {
	var top = this.top;
	var left = this.left;

	if (left < 0) {
		left = 0;
	} else if (left > this.W - this.width) {
		left = this.W - this.width;
	}
	if (top < 0) {
		top = 0;
	} else if (top > this.H - this.menuH - this.height) {
		top = this.H - this.menuH - this.height;
	}

	// 拖拉拽结束溢出边界修正
	if (!this.moveFlag) {
		this.top = top;
		this.left = left;
	}

	this.dom.style.cssText = 'width: '+this.width+'px; height: '+this.height+'px; transform: translate('+left+'px, '+top+'px); z-index:' + this.index;
}

// move2 移动边界
PlaneDrag.prototype.moveBound2 = function() {	

	var top = this.top;
	var left = this.left;
	var width = this.width;
	var height = this.height

	if (this.status.indexOf('right') > -1) {
		// 移动代码
		if (width > this.W - left) {
			width = this.W - left;
		} else if (width < this.minW){
			width = this.minW;
		}
	}

	if (this.status.indexOf('left') > -1) {
		if (left < 0) {
			left = 0;
			width = this.totalW;
		} else if (width < this.minW){
			width = this.minW;
			left = this.totalW - width;
		}
	}

	if (this.status.indexOf('top') > -1) {
		if (top < 0) {
			top = 0;
			height = this.totalH;
		} else if (height < this.minH){
			height = this.minH;
			top = this.totalH - height;
		}
	}

	if (this.status.indexOf('bottom') > -1){
		if (height > this.H - top - this.menuH) {
			height = this.H - top - this.menuH;
		} else if (height < this.minH){
			height = this.minH;
		}
	}

	// 拖拉拽结束溢出边界修正
	if (!this.moveFlag) {
		this.top = top;
		this.left = left;
		this.width = width;
		this.height = height;
	}

	// 渲染tips
	this.showTips(width, height, left, top);
	this.dom.style.cssText = 'width: '+width+'px; height: '+height+'px; transform: translate('+left+'px, '+top+'px); z-index:' + this.index;
}