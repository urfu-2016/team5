# Приложение "Квесты" (Team-5)

## Workflow

### Начало работы
1. Делаем fork (будем называть его origin)
2. Добавляем удаленный репозиторий, upstream ( `git remote add upstream https://github.com/urfu-2016/team5.git` )
3. Делаем ветку ( `git checkout -b branch_name` )
4. Делаем изменения

### Вносим изменения в upstream
1. Добавляем изменения локально ( `git add .` )
2. Делаем коммит ( `git commit -m "Хорошее осмысленное сообщение"` )
3. Фиксируем изменения в origin ( `git push -u origin branch_name` )
4. Делаем пулл реквест через интерфейс github

### Забираем изменения с upstream
Если upstream изменился, во время того, как мы делаем изменения в origin,
чтобы сделать ПР, нужно чтобы наш origin был актуальным. Для этого:

1. Забираем изменения с upstream `git pull --rebase upstream master`
2. Делаем перепуш `git push origin branch_name -f`
