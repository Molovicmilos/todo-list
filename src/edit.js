import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { CheckboxControl, TextControl, Button } from '@wordpress/components';
import './editor.scss';

export default function Edit() {
	const [ newTodo, setNewTodo ] = useState( '' );
	const [ addingTodo, setAddingTodo ] = useState( false );

	const todos = useSelect( ( select ) => {
		const todosStore = select( 'blocks-u/todos' );
		return todosStore && todosStore.getTodos();
	}, [] );

	const actions = useDispatch( 'blocks-u/todos' );
	const addTodo = actions && actions.addTodo;

	const toggleTodo = actions && actions.toggleTodo;

	return (
		<div { ...useBlockProps() }>
			{ ! todos && (
				<p>
					{ __(
						'Please make sure your plugin is activated',
						'todo-list'
					) }
				</p>
			) }
			{ todos && (
				<ul>
					{ todos.map( ( todo, index ) => (
						<li
							key={ todo.id }
							className={ todo.completed && 'todo-completed' }
						>
							<CheckboxControl
								disabled={ todo.loading }
								label={ todo.title }
								checked={ todo.completed }
								onChange={ () => {
									if ( toggleTodo ) toggleTodo( todo, index );
								} }
							/>
						</li>
					) ) }
				</ul>
			) }
			<form
				onSubmit={ async ( event ) => {
					event.preventDefault();
					if ( addTodo && newTodo ) {
						setAddingTodo( true );
						await addTodo( newTodo );
						setNewTodo( '' );
						setAddingTodo( false );
					}
				} }
				className="addtodo-form"
			>
				<TextControl
					value={ newTodo }
					onChange={ ( val ) => setNewTodo( val ) }
				/>
				<Button disabled={ addingTodo } type="submit" variant="primary">
					{ __( 'Add Todo', 'todo-list' ) }
				</Button>
			</form>
		</div>
	);
}
