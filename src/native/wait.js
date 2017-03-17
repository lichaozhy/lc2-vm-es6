const {Statement} = require('es-vm');
/**
 * 	{
 * 		BODY: {
 * 			SYMBOL: 'WAIT',
 *          WAIT: <string | lc2 expression>
 * 		}
 * 	}
 */
class WaitStatement extends Statement {
	constructor ({POSITION, BODY}) {
		super({POSITION});

		this.delay = this.$linkBySymbol(BODY.DELAY);
	}
	
	*execute(vm) {
		yield* this.delay.doExecution(vm);
		const delay = vm.ret;

		//TODO check vm.ret is Number or not.
		setTimeout(() => {
			vm.writeback(null, true);
			vm.emit('[WAIT]', vm);
			vm.$run();
		}, delay);
		yield 'VM::BLOCKED';
		
		yield vm.emit('driver', {
			type: 'wait',
			data: {
				line: this.position && this.position.LINE,
				delay
			}
		});
	}
}
module.exports = WaitStatement.register('WAIT');