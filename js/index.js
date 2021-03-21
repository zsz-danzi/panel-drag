window.onload = () => {
	let index = 1;
	let domArr = [];
	let boxIndex = 0;

	let btn = document.getElementById('btn');
	let parent = document.getElementById('parent');

	let objectPool = []; // 对象池
	let renderPool = []; // 渲染池

	btn.addEventListener('click', () => {
		if (objectPool.length == 0) {
			boxIndex++;
			index++;

			let div = document.createElement('div');
			div.className = 'plane-box';
			div.id = 'box' + boxIndex;

			let html = '<div class="box-hd">\
										标题\
										<i class="icon-close"></i>\
									</div>\
									<div class="box-content">\
										<!-- <div class="content-1"></div> -->\
									</div>'
			div.innerHTML = html;

			parent.appendChild(div);

			let planeDrag = new PlaneDrag({
				id: 'box' + (boxIndex),
				index: index,
			});

			planeDrag.dom.addEventListener('mousedown', function() {
				if (this.headClick) {
					this.headClick = false;
					return;
				}
				index++;
				this.setZindex(index);
				this.render1();
			}.bind(planeDrag), false);

			planeDrag.head.addEventListener('mousedown', function(ev) {
				this.headClick = true;
				index++;
				this.setZindex(index);
			}.bind(planeDrag), false);


			planeDrag.head.children[0].addEventListener('mousedown', function(ev) {
				ev.stopPropagation();
				this.hide();
				objectPool.push(this);
			}.bind(planeDrag), false)


		} else {
			// 从对象池中取出来
			let planeDrag = objectPool[0];
			index++;
			planeDrag.setZindex(index);
			planeDrag.reset();
			// planeDrag.show();
			objectPool.shift();
		}

	}, false)
}