import MD from 'markdown-it';

const markdown = markdownStr => {
    const md = MD();

    return md.render(markdownStr);
};

export default markdown;