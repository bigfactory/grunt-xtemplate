# grunt-xtemplate

> xtemplate compiler for grunt

## 环境依赖
Grunt `~0.4.5`

## 安装
```
$ npm install grunt-xtemplate --save-dev
```

## 配置
```
grunt.loadNpmTasks('grunt-xtemplate');
```

### 任务配置

```
grunt.initConfig({
    xtemplate: {
        compile: {
            files: [{
                src: './test//*.xtpl'
            }]
        }
    }
});
```

## 使用

```
$ grunt xtemplat:compile
```

