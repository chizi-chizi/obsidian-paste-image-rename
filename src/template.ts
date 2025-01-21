import { FrontMatterCache } from 'obsidian';

const dateTmplRegex = /{{DATE:([^}]+)}}/gm
const frontmatterTmplRegex = /{{frontmatter:([^}]+)}}/gm

// const replaceDateVar = (s: string, date: moment.Moment): string => {
// 	const m = dateTmplRegex.exec(s)
// 	if (!m) return s
// 	return s.replace(m[0], date.format(m[1]))
// }

//添加一个新的正则表达式来捕获固定格式的时间
const customDateTmplRegex = /{{(\w+)}}/g

//更新的replaceDateVar函数
const replaceDateVar = (s: string, date: moment.Moment): string => {
	//替换{{DATE:...}}形式的占位符
	s = s.replace(/{{DATE:([^}]+)}}/g, (_, format) =>{
		return date.format(format);
	});

	//替换{{...}}形式的固定占位符
	s = s.replace(customDateTmplRegex, (_, format) =>{
		return date.format(format);
	});
	return s;
}

const replaceFrontmatterVar = (s: string, frontmatter?: FrontMatterCache): string => {
	if (!frontmatter) return s
	const m = frontmatterTmplRegex.exec(s)
	if (!m) return s
	return s.replace(m[0], frontmatter[m[1]] || '')
}

interface TemplateData {
	imageNameKey: string
	fileName: string
	dirName: string
	firstHeading: string
}

export const renderTemplate = (tmpl: string, data: TemplateData, frontmatter?: FrontMatterCache) => {
	const now = window.moment()
	let text = tmpl
	let newtext
	while ((newtext = replaceDateVar(text, now)) != text) {
		text = newtext
	}
	while ((newtext = replaceFrontmatterVar(text, frontmatter)) != text) {
		text = newtext
	}

	text = text
		.replace(/{{imageNameKey}}/gm, data.imageNameKey)
		.replace(/{{fileName}}/gm, data.fileName)
		.replace(/{{dirName}}/gm, data.dirName)
		.replace(/{{firstHeading}}/gm, data.firstHeading)
	return text
}
