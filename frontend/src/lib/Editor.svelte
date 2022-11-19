<script>
  // @ts-nocheck

  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import CharacterCount from '@tiptap/extension-character-count';
  import { text } from 'svelte/internal';
  import { questions } from '../store.js';
  import Card from './Card.svelte';
  let element;
  let editor;

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [StarterKit, CharacterCount],
      content: '',
      autofocus: true,
      editable: true,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  let generateQuestions = async (data) => {
    // Clean up to only send final string
    let paragraphs = data.content;
    let string = '';
    paragraphs.forEach((element) => {
      let paragraph = element.content;
      if (!(paragraph == undefined)) {
        string += paragraph[0].text + ' ';
      }
    });

    const response = await fetch('http://127.0.0.1:5000/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: string,
    });
    questions.set((await response.json()).questions);
  };
</script>

{#if editor}
  <!--  <button-->
  <!--          on:click={() => editor.chain().focus().toggleHeading({ level: 1}).run()}-->
  <!--          class:active={editor.isActive('heading', { level: 1 })}-->
  <!--  >-->
  <!--    H1-->
  <!--  </button>-->
  <!--  <button-->
  <!--          on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}-->
  <!--          class:active={editor.isActive('heading', { level: 2 })}-->
  <!--  >-->
  <!--    H2-->
  <!--  </button>-->
  <!--  <button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>-->
  <!--    P-->
  <!--  </button>-->
{/if}

<div bind:this={element} />

{#if editor}
  <p>{editor.storage.characterCount.words()} words</p>
  <button on:click={generateQuestions(editor.getJSON())}
    >Generate Questions</button>
{/if}

{#if Array.isArray($questions)}
  {#each $questions as question}
    <Card query={question.query} answer={question.answer} />
  {/each}
{/if}