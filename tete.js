let arr = [];
function hanoiTower(n, A, B, C) {
	console.log('h_____', [n, A, B, C]);
	if (n === 1) {
		arr.push([A, C]);
		// console.log(`111, 원판 1  ${A} to ${C}`);
	} else {
		// console.log(222);
		hanoiTower(n - 1, A, C, B);
		arr.push([A, C]);
		// console.log(`333, 원판 ${n}  ${A} to ${C}`);
		hanoiTower(n - 1, B, C, A);
	}
}

//하노이탑 2번째 문제
// let f = (n, i, j) => {
// 	if (n == 1) return [i, j];
// 	return [...f(n - 1, i, 6 - i - j), (i, j), ...f(n - 1, 6 - i - j, j)];
// };
// f(n, 1, 3);

// // 하노이 탑 문제 호출
const numOfDisks = 4; // 예시로 3개의 원판으로 이루어진 탑을 생각해봅시다.
hanoiTower(numOfDisks, 'A', 'B', 'C');

// function hano2(n, A, B, C, D, E) {
// 	if (n === 1) {
// 		arr.push([A, E]);
// 		console.log(`원판 1  ${A} to ${E}`);
// 	} else {
// 		hano2(n - 1, A);
// 	}
// }
