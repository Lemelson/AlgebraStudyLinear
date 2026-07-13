export const examGeneratedVariantsB = [
  {
    id: 'real-5-foundation',
    parentNumber: 5,
    variantId: 'foundation',
    origin: 'generated',
    title: 'Ортогональная диагонализация с простым спектром',
    classification: 'Спектральная теорема · базовый перенос',
    difficulty: { level: 'foundation', label: 'Базовый', rationale: 'Собственные значения целые и различны, поэтому внимание сосредоточено на ортонормированном базисе и спектральном разложении.' },
    statement: String.raw`Для симметричной матрицы
$$A=\begin{pmatrix}2&1&0\\1&2&0\\0&0&4\end{pmatrix}$$
найдите ортонормированный базис из собственных векторов, матрицу $Q$ ортогонального перехода и спектральное разложение $A=Q\Lambda Q^T$. Затем вычислите $A^n$, $n\in\mathbb N$.`,
    generalization: String.raw`Для симметрической матрицы собственные подпространства разных собственных значений ортогональны, а $A^n=Q\Lambda^nQ^T$.`,
    hints: [
      { title: 'Начните с блока', body: String.raw`Левый верхний блок $\begin{pmatrix}2&1\\1&2\end{pmatrix}$ имеет собственные направления $(1,1)^T$ и $(1,-1)^T$.` },
      { title: 'Не забудьте нормировку', body: String.raw`Векторы $(1,1,0)^T$ и $(1,-1,0)^T$ имеют длину $\sqrt2$.` },
      { title: 'Степень без умножений', body: String.raw`Возведите диагональные элементы $\Lambda$ в степень $n$, а затем раскройте $Q\Lambda^nQ^T$.` },
    ],
    solution: {
      idea: String.raw`Используем блочную структуру и спектральную теорему, после чего степень вычисляется покомпонентно по спектральным проекторам.`,
      steps: [
        { title: 'Спектр', body: String.raw`Характеристический многочлен равен $(1-\lambda)(3-\lambda)(4-\lambda)$, поэтому собственные значения: $1,3,4$.` },
        { title: 'Ортонормированный собственный базис', body: String.raw`Можно взять
$$q_1=\frac1{\sqrt2}(1,-1,0)^T,\quad q_2=\frac1{\sqrt2}(1,1,0)^T,\quad q_3=(0,0,1)^T.$$
Тогда $Aq_1=q_1$, $Aq_2=3q_2$, $Aq_3=4q_3$.` },
        { title: 'Диагонализация', body: String.raw`Для $Q=(q_1\ q_2\ q_3)$ имеем $Q^TQ=I$ и
$$A=Q\operatorname{diag}(1,3,4)Q^T.$$` },
        { title: 'Степень', body: String.raw`Поэтому
$$A^n=Q\operatorname{diag}(1,3^n,4^n)Q^T
=\begin{pmatrix}\frac{3^n+1}{2}&\frac{3^n-1}{2}&0\\[2pt]\frac{3^n-1}{2}&\frac{3^n+1}{2}&0\\0&0&4^n\end{pmatrix}.$$` },
      ],
      answer: String.raw`$Q=\begin{pmatrix}1/\sqrt2&1/\sqrt2&0\\-1/\sqrt2&1/\sqrt2&0\\0&0&1\end{pmatrix}$, $\Lambda=\operatorname{diag}(1,3,4)$, а $A^n$ имеет вид, указанный выше.`,
    },
    verification: [String.raw`Прямое умножение даёт $Aq_i=\lambda_iq_i$.`, String.raw`При $n=1$ формула для $A^n$ возвращает исходную матрицу.`],
    commonMistakes: [String.raw`Использовать ненормированные собственные векторы и затем ошибочно писать $Q^{-1}=Q^T$.`, String.raw`Возвести в степень элементы исходной матрицы вместо собственных значений.`],
    selfCheck: [
      { prompt: String.raw`Чему равен $A^0$ по полученной формуле?`, answer: String.raw`$I_3$.`, explanation: String.raw`Все три собственных значения в нулевой степени равны $1$.` },
      { prompt: String.raw`Почему собственные векторы для $1$ и $3$ ортогональны?`, answer: 'Матрица симметрична.', explanation: String.raw`Собственные подпространства симметрического оператора, отвечающие различным значениям, ортогональны.` },
    ],
  },
  {
    id: 'real-5-transfer', parentNumber: 5, variantId: 'transfer', origin: 'generated',
    title: 'Кратный спектр и спектральные проекторы', classification: 'Спектральная теорема · функциональное исчисление',
    difficulty: { level: 'transfer', label: 'Перенос', rationale: 'Нужно работать не с отдельным собственным базисом, а с целыми собственными подпространствами и проекторами.' },
    statement: String.raw`Для матрицы
$$A=\begin{pmatrix}3&1&1\\1&3&1\\1&1&3\end{pmatrix}$$
найдите собственные значения и ортогональные спектральные проекторы. Вычислите без перемножения матриц
$$f(A),\qquad f(t)=t^3-4t+1.$$`,
    generalization: String.raw`Если $A=\sum\lambda P_\lambda$, то для любого многочлена $f$ выполняется $f(A)=\sum f(\lambda)P_\lambda$.`,
    hints: [{ title: 'Выделите матрицу единиц', body: String.raw`Запишите $A=2I+J$, где все элементы $J$ равны $1$.` }, { title: 'Два подпространства', body: String.raw`Вектор $(1,1,1)^T$ — собственный для $J$, а плоскость $x_1+x_2+x_3=0$ является его ядром.` }, { title: 'Подставьте значения', body: String.raw`Достаточно вычислить $f(2)$ и $f(5)$.` }],
    solution: { idea: String.raw`Разлагаем пространство на прямую $L(1,1,1)$ и её ортогональное дополнение.`, steps: [
      { title: 'Собственные значения', body: String.raw`На $L(1,1,1)$ матрица $J$ действует умножением на $3$, поэтому $A$ имеет значение $5$. На плоскости $x_1+x_2+x_3=0$ матрица $J$ равна нулю, поэтому значение $A$ равно $2$ с кратностью $2$.` },
      { title: 'Проектор на прямую', body: String.raw`Для $u=(1,1,1)^T$ получаем
$$P_5=\frac{uu^T}{u^Tu}=\frac13J.$$` },
      { title: 'Проектор на плоскость', body: String.raw`Второй проектор равен
$$P_2=I-P_5=I-\frac13J,$$
причём $P_2P_5=0$ и $P_2+P_5=I$.` },
      { title: 'Многочлен от матрицы', body: String.raw`$f(2)=1$, $f(5)=106$, поэтому
$$f(A)=P_2+106P_5=I+105P_5=I+35J
=\begin{pmatrix}36&35&35\\35&36&35\\35&35&36\end{pmatrix}.$$` },
    ], answer: String.raw`Спектр: $2$ (кратность $2$) и $5$; $P_2=I-J/3$, $P_5=J/3$, $f(A)=I+35J$.` },
    verification: [String.raw`$P_2^2=P_2$, $P_5^2=P_5$ и $P_2P_5=0$.`, String.raw`На $(1,1,1)^T$ матрица $f(A)$ действует умножением на $106$, а на плоскости суммы координат ноль — умножением на $1$.`],
    commonMistakes: [String.raw`Искать единственный «правильный» базис в двумерном собственном подпространстве.`, String.raw`Заменять $f(A)$ матрицей, полученной поэлементным применением $f$.`],
    selfCheck: [{ prompt: String.raw`Чему равен $A^{2026}$?`, answer: String.raw`$2^{2026}P_2+5^{2026}P_5$.`, explanation: String.raw`Это та же формула функционального исчисления для $f(t)=t^{2026}$.` }, { prompt: String.raw`Каково ядро $P_5$?`, answer: String.raw`Плоскость $x_1+x_2+x_3=0$.`, explanation: String.raw`$P_5$ проецирует ортогонально на $L(1,1,1)$.` }],
  },
  {
    id: 'real-6-foundation', parentNumber: 6, variantId: 'foundation', origin: 'generated',
    title: 'Полярное разложение без иррационального корня', classification: 'Полярное разложение · невырожденная матрица',
    difficulty: { level: 'foundation', label: 'Базовый', rationale: 'Положительный квадратный корень угадывается по малой целочисленной матрице.' },
    statement: String.raw`Найдите левое полярное разложение $A=SO$ матрицы
$$A=\begin{pmatrix}1&-2\\2&-1\end{pmatrix},$$
где $S$ симметрична и положительно определена, а $O$ ортогональна.`,
    generalization: String.raw`Для невырожденной квадратной матрицы $S=\sqrt{AA^T}$ и $O=S^{-1}A$; оба множителя единственны.`,
    hints: [{ title: 'Сначала квадрат', body: String.raw`Вычислите $AA^T$.` }, { title: 'Проверьте простой корень', body: String.raw`Попробуйте возвести в квадрат $\begin{pmatrix}2&1\\1&2\end{pmatrix}$.` }, { title: 'Второй множитель', body: String.raw`После нахождения $S$ используйте $O=S^{-1}A$.` }],
    solution: { idea: String.raw`Строим единственный положительный корень из $AA^T$, затем отделяем ортогональную часть.`, steps: [
      { title: 'Произведение', body: String.raw`$$AA^T=\begin{pmatrix}5&4\\4&5\end{pmatrix}.$$` },
      { title: 'Положительный корень', body: String.raw`Матрица
$$S=\begin{pmatrix}2&1\\1&2\end{pmatrix}$$
удовлетворяет $S^2=AA^T$ и имеет собственные значения $1,3>0$.` },
      { title: 'Ортогональная часть', body: String.raw`Так как $S^{-1}=\frac13\begin{pmatrix}2&-1\\-1&2\end{pmatrix}$, то
$$O=S^{-1}A=\begin{pmatrix}0&-1\\1&0\end{pmatrix}.$$` },
      { title: 'Сборка', body: String.raw`$O^TO=I$, и прямое умножение даёт
$$SO=\begin{pmatrix}2&1\\1&2\end{pmatrix}\begin{pmatrix}0&-1\\1&0\end{pmatrix}=A.$$` },
    ], answer: String.raw`$A=\begin{pmatrix}2&1\\1&2\end{pmatrix}\begin{pmatrix}0&-1\\1&0\end{pmatrix}$.` },
    verification: [String.raw`$S^2=AA^T$.`, String.raw`$O^TO=I$ и $SO=A$.`],
    commonMistakes: [String.raw`Извлекать квадратный корень из $AA^T$ поэлементно.`, String.raw`Использовать $\sqrt{A^TA}$ слева вместо справа.`],
    selfCheck: [{ prompt: String.raw`Почему $S$ положительно определена?`, answer: String.raw`Её собственные значения равны $1$ и $3$.`, explanation: String.raw`Симметрическая матрица положительно определена тогда и только тогда, когда все её собственные значения положительны.` }, { prompt: String.raw`Какое преобразование задаёт $O$?`, answer: String.raw`Поворот на $90^\circ$.`, explanation: String.raw`$(x,y)^T\mapsto(-y,x)^T$.` }],
  },
  {
    id: 'real-6-transfer', parentNumber: 6, variantId: 'transfer', origin: 'generated',
    title: 'Прямоугольная матрица и частичная изометрия', classification: 'SVD и полярное разложение · вырожденный случай',
    difficulty: { level: 'transfer', label: 'Перенос', rationale: 'Нулевое сингулярное значение заставляет различать каноническую частичную изометрию и её неединственные изометрические продолжения.' },
    statement: String.raw`Для матрицы
$$A=\begin{pmatrix}1&-1\\2&-2\\2&-2\end{pmatrix}$$
постройте SVD и правое полярное разложение $A=WH$, где $H=\sqrt{A^TA}\ge0$. Найдите каноническую частичную изометрию $W$ и объясните, что именно неединственно при продолжении $W$ на $\ker A$.`,
    generalization: String.raw`Для вырожденной матрицы канонический полярный множитель единственен при условии $\ker W=\ker A$, но его изометрическое продолжение на ядро не единственно.`,
    hints: [{ title: 'Ранг один', body: String.raw`Все строки кратны $(1,-1)$.` }, { title: 'Нормированные направления', body: String.raw`Возьмите $u_1=(1,2,2)^T/3$ и $v_1=(1,-1)^T/\sqrt2$.` }, { title: 'Нулевая часть', body: String.raw`На $v_2=(1,1)^T/\sqrt2$ матрица $A$ равна нулю.` }],
    solution: { idea: String.raw`Представляем матрицу как одно внешнее произведение и читаем из него единственное ненулевое сингулярное значение.`, steps: [
      { title: 'Ранговое представление', body: String.raw`Имеем
$$A=3\sqrt2\,u_1v_1^T,\quad u_1=\frac13(1,2,2)^T,\quad v_1=\frac1{\sqrt2}(1,-1)^T.$$` },
      { title: 'Полное SVD', body: String.raw`Дополняем
$$u_2=\frac13(2,-2,1)^T,\quad u_3=\frac13(2,1,-2)^T,\quad v_2=\frac1{\sqrt2}(1,1)^T.$$
Тогда при $U=(u_1\ u_2\ u_3)$, $V=(v_1\ v_2)$:
$$A=U\begin{pmatrix}3\sqrt2&0\\0&0\\0&0\end{pmatrix}V^T.$$` },
      { title: 'Положительный множитель', body: String.raw`$$H=V\operatorname{diag}(3\sqrt2,0)V^T
=\frac3{\sqrt2}\begin{pmatrix}1&-1\\-1&1\end{pmatrix}.$$` },
      { title: 'Частичная изометрия и единственность', body: String.raw`Канонически
$$W=u_1v_1^T=\frac1{3\sqrt2}\begin{pmatrix}1&-1\\2&-2\\2&-2\end{pmatrix},$$
так что $A=WH$, $Wv_1=u_1$, $Wv_2=0$. Если потребовать изометрию на всей $\mathbb R^2$, можно вместо нуля положить $Wv_2=z$, где $z$ — любой единичный вектор, ортогональный $u_1$; такое продолжение не единственно.` },
    ], answer: String.raw`Единственное ненулевое сингулярное значение равно $3\sqrt2$; $H=\frac3{\sqrt2}\begin{pmatrix}1&-1\\-1&1\end{pmatrix}$, каноническое $W=A/(3\sqrt2)$.` },
    verification: [String.raw`$W^TW=v_1v_1^T$, то есть проектор на $(\ker A)^\perp$.`, String.raw`Прямое произведение $WH$ равно $A$.`],
    commonMistakes: [String.raw`Требовать $W^TW=I$ от канонической частичной изометрии ранга один.`, String.raw`Считать нулевое сингулярное направление uniquely определяющим столбец $U$.`],
    selfCheck: [{ prompt: String.raw`Чему равно $\ker A$?`, answer: String.raw`$L(1,1)^T$.`, explanation: String.raw`Столбцы противоположны, поэтому $A(x,y)^T=0$ при $x=y$.` }, { prompt: String.raw`Почему продолжение не единственно?`, answer: String.raw`Действие на $\ker A$ не влияет на произведение $WH$.`, explanation: String.raw`Матрица $H$ уничтожает ядро до применения левого множителя.` }],
  },
  {
    id: 'real-7-foundation', parentNumber: 7, variantId: 'foundation', origin: 'generated',
    title: 'Расстояние до аффинной прямой многочленов', classification: 'Евклидово пространство функций · проекция',
    difficulty: { level: 'foundation', label: 'Базовый', rationale: 'Симметричный промежуток зануляет нечётные интегралы, а остаток получается одним мономом.' },
    statement: String.raw`В $V=\mathbb R[x]_{\le2}$ задано скалярное произведение
$$\langle f,g\rangle=\int_{-1}^{1}f(x)g(x)\,dx.$$
Найдите ближайший к $h(x)=2x^2+2x+3$ многочлен из аффинной прямой
$$1-x+L(x^2+1)$$
и расстояние до этой прямой.`,
    generalization: String.raw`Ближайшая точка $w+tv$ определяется условием $\langle h-w-tv,v\rangle=0$.`,
    hints: [{ title: 'Параметризация', body: String.raw`Пишите $p_t=1-x+t(x^2+1)$.` }, { title: 'Ортогональность', body: String.raw`Для минимума остаток $h-p_t$ должен быть ортогонален $x^2+1$.` }, { title: 'Симметрия', body: String.raw`Интеграл нечётной функции на $[-1,1]$ равен нулю.` }],
    solution: { idea: String.raw`Проецируем $h-(1-x)$ на направляющий многочлен $x^2+1$.`, steps: [
      { title: 'Аффинная параметризация', body: String.raw`$$p_t(x)=1-x+t(x^2+1).$$` },
      { title: 'Коэффициент проекции', body: String.raw`$$t=\frac{\langle h-(1-x),x^2+1\rangle}{\langle x^2+1,x^2+1\rangle}.
$$
Так как $h-(1-x)=2(x^2+1)+3x$, а $3x\perp(x^2+1)$, получаем $t=2$.` },
      { title: 'Ближайшая точка', body: String.raw`$$p_2(x)=1-x+2(x^2+1)=2x^2-x+3.$$` },
      { title: 'Расстояние', body: String.raw`Остаток $h-p_2=3x$, поэтому
$$\operatorname{dist}=\|3x\|=\sqrt{9\int_{-1}^{1}x^2dx}=\sqrt6.$$` },
    ], answer: String.raw`Ближайший многочлен: $2x^2-x+3$; расстояние: $\sqrt6$.` },
    verification: [String.raw`Разность $h-p_2=3x$ ортогональна $x^2+1$.`, String.raw`Многочлен $p_2$ имеет требуемый вид $1-x+2(x^2+1)$.`],
    commonMistakes: [String.raw`Считать аффинную прямую линейной оболочкой двух многочленов.`, String.raw`Минимизировать обычные коэффициенты вместо заданной интегральной нормы.`],
    selfCheck: [{ prompt: String.raw`Почему не нужно вычислять смешанный интеграл полностью?`, answer: 'Подынтегральная функция нечётна.', explanation: String.raw`$x(x^2+1)$ нечётна на симметричном промежутке.` }, { prompt: String.raw`Как изменится расстояние для $h+c(x^2+1)$?`, answer: 'Не изменится.', explanation: String.raw`Добавка лежит в направляющем пространстве аффинной прямой.` }],
  },
  {
    id: 'real-7-transfer', parentNumber: 7, variantId: 'transfer', origin: 'generated',
    title: 'Расстояние между аффинными прямыми матриц', classification: 'Фробениусово пространство · ближайшая пара',
    difficulty: { level: 'transfer', label: 'Перенос', rationale: 'Идея ортогонального остатка переносится из пространства полиномов в пространство матриц и требует решить связанную систему параметров.' },
    statement: String.raw`В $M_{2\times2}(\mathbb R)$ используется скалярное произведение Фробениуса $\langle X,Y\rangle_F=\operatorname{tr}(Y^TX)$. Найдите расстояние и единственную пару ближайших точек между
$$\mathcal A=L(I),\qquad
\mathcal B=\begin{pmatrix}2&2\\-2&3\end{pmatrix}+L\!\left(\begin{pmatrix}1&1\\0&0\end{pmatrix}\right).$$`,
    generalization: String.raw`Вектор разности ближайших точек двух аффинных подпространств ортогонален обоим направляющим подпространствам.`,
    hints: [{ title: 'Два параметра', body: String.raw`Пишите $X=tI$ и $Y=X_0+sW$.` }, { title: 'Два условия', body: String.raw`Для $D=X-Y$ потребуйте $\langle D,I\rangle_F=0$ и $\langle D,W\rangle_F=0$.` }, { title: 'Норма', body: String.raw`После нахождения параметров расстояние равно $\sqrt{\sum d_{ij}^2}$.` }],
    solution: { idea: String.raw`Минимизируем норму разности, требуя её ортогональности обоим допустимым направлениям движения.`, steps: [
      { title: 'Параметризация', body: String.raw`Положим
$$X=tI,\quad Y=X_0+sW,\quad X_0=\begin{pmatrix}2&2\\-2&3\end{pmatrix},\quad W=\begin{pmatrix}1&1\\0&0\end{pmatrix}.$$` },
      { title: 'Нормальные уравнения', body: String.raw`Для $D=tI-X_0-sW$ условия ортогональности дают
$$2t-s=5,\qquad t-2s=4,$$
поскольку $\langle I,I\rangle=2$, $\langle W,W\rangle=2$, $\langle I,W\rangle=1$.` },
      { title: 'Ближайшие точки', body: String.raw`Решение: $t=2$, $s=-1$. Поэтому
$$X_*=\begin{pmatrix}2&0\\0&2\end{pmatrix},\qquad Y_*=\begin{pmatrix}1&1\\-2&3\end{pmatrix}.$$` },
      { title: 'Расстояние', body: String.raw`$$D_*=X_*-Y_*=\begin{pmatrix}1&-1\\2&-1\end{pmatrix},\qquad
\|D_*\|_F=\sqrt{1+1+4+1}=\sqrt7.$$` },
    ], answer: String.raw`Ближайшая пара: $X_*=2I$ и $Y_*=\begin{pmatrix}1&1\\-2&3\end{pmatrix}$; расстояние $\sqrt7$.` },
    verification: [String.raw`$\langle D_*,I\rangle_F=0$ и $\langle D_*,W\rangle_F=0$.`, String.raw`Матрицы $X_*$ и $Y_*$ принадлежат соответствующим аффинным прямым.`],
    commonMistakes: [String.raw`Искать расстояние только между заданными начальными точками.`, String.raw`Потребовать ортогональность лишь одному из двух направлений.`],
    selfCheck: [{ prompt: String.raw`Почему ближайшая пара единственна?`, answer: 'Направления линейно независимы.', explanation: String.raw`Квадратичная функция параметров строго выпукла, поскольку $I$ и $W$ не пропорциональны.` }, { prompt: String.raw`Как вычисляется норма Фробениуса?`, answer: String.raw`Как квадратный корень из суммы квадратов элементов.`, explanation: String.raw`$\|D\|_F^2=\operatorname{tr}(D^TD)=\sum d_{ij}^2$.` }],
  },
  {
    id: 'real-8-foundation', parentNumber: 8, variantId: 'foundation', origin: 'generated',
    title: 'Эллипс, требующий только сдвига', classification: 'Коники · параллельный перенос',
    difficulty: { level: 'foundation', label: 'Базовый', rationale: 'Смешанного члена нет, поэтому достаточно выделить полные квадраты и прочитать геометрию.' },
    statement: String.raw`Приведите к каноническому виду уравнение
$$4x^2+9y^2-8x+36y+4=0.$$
Укажите преобразование координат, тип кривой, центр, полуоси, эксцентриситет и данные для эскиза.`,
    generalization: String.raw`Если квадратичная часть уже диагональна, линейные члены устраняются выделением полных квадратов.`,
    hints: [{ title: 'Группировка', body: String.raw`Соберите отдельно выражения $4x^2-8x$ и $9y^2+36y$.` }, { title: 'Полные квадраты', body: String.raw`$x^2-2x=(x-1)^2-1$, $y^2+4y=(y+2)^2-4$.` }, { title: 'Эксцентриситет', body: String.raw`Для эллипса $c^2=a^2-b^2$ и $e=c/a$.` }],
    solution: { idea: String.raw`Выделяем два полных квадрата; поворот осей не нужен.`, steps: [
      { title: 'Выделение квадратов', body: String.raw`$$4(x-1)^2+9(y+2)^2=36.$$` },
      { title: 'Новые координаты', body: String.raw`При $X=x-1$, $Y=y+2$ получаем
$$\frac{X^2}{9}+\frac{Y^2}{4}=1.$$` },
      { title: 'Геометрические параметры', body: String.raw`Это эллипс с центром $(1,-2)$, большой полуосью $a=3$ вдоль $Ox$ и малой $b=2$ вдоль $Oy$. $c=\sqrt{9-4}=\sqrt5$, поэтому $e=\sqrt5/3$.` },
      { title: 'Эскиз', body: String.raw`Вершины: $(4,-2)$, $(-2,-2)$, $(1,0)$, $(1,-4)$; фокусы: $(1\pm\sqrt5,-2)$.` },
    ], answer: String.raw`$X^2/9+Y^2/4=1$, где $X=x-1$, $Y=y+2$; центр $(1,-2)$, полуоси $3$ и $2$, эксцентриситет $\sqrt5/3$.` },
    verification: [String.raw`Обратная подстановка $x=X+1$, $y=Y-2$ возвращает исходное уравнение.`, String.raw`Все четыре указанные вершины удовлетворяют исходному уравнению.`],
    commonMistakes: [String.raw`Перепутать знак сдвига для координаты $y$.`, String.raw`Взять $a=2$, хотя большой знаменатель равен $9$.`],
    selfCheck: [{ prompt: String.raw`Нужен ли здесь поворот?`, answer: 'Нет.', explanation: String.raw`Смешанного члена $xy$ нет, квадратичная часть уже диагональна.` }, { prompt: String.raw`Где находится правый фокус?`, answer: String.raw`$(1+\sqrt5,-2)$.`, explanation: String.raw`Фокусы лежат на большой горизонтальной оси на расстоянии $c=\sqrt5$ от центра.` }],
  },
  {
    id: 'real-8-transfer', parentNumber: 8, variantId: 'transfer', origin: 'generated',
    title: 'Гипербола: поворот, сдвиг и обратная проверка', classification: 'Коники · полное ортогональное приведение',
    difficulty: { level: 'transfer', label: 'Перенос', rationale: 'Нужно одновременно диагонализировать смешанную квадратичную часть, найти центр и проследить прямое и обратное преобразования.' },
    statement: String.raw`Приведите к каноническому виду уравнение
$$-3x^2+10xy-3y^2+26x-22y-43=0.$$
Найдите ортогональное преобразование и сдвиг, тип кривой, центр, полуоси, эксцентриситет и асимптоты в канонических координатах. Выполните обратную проверку преобразования.`,
    generalization: String.raw`Для центральной коники сначала ортогонально диагонализируют матрицу квадратичной части, затем переносят начало в центр, решая линейную систему для градиента.`,
    hints: [{ title: 'Матрица формы', body: String.raw`Квадратичной части соответствует $B=\begin{pmatrix}-3&5\\5&-3\end{pmatrix}$.` }, { title: 'Собственные направления', body: String.raw`Проверьте направления $(1,1)^T$ и $(1,-1)^T$.` }, { title: 'Центр', body: String.raw`Решите $2Bc+d=0$, где $d=(26,-22)^T$.` }],
    solution: { idea: String.raw`Собственные оси расположены под углом $45^\circ$; после переноса в центр линейные члены исчезают.`, steps: [
      { title: 'Собственные оси', body: String.raw`У $B$ собственные значения $2$ и $-8$ с единичными векторами
$$q_1=\frac1{\sqrt2}(1,1)^T,\qquad q_2=\frac1{\sqrt2}(1,-1)^T.$$` },
      { title: 'Центр и координаты', body: String.raw`Из $2Bc+d=0$ получаем $c=(1,-2)^T$. Полагаем $X=x-1$, $Y=y+2$ и
$$U=\frac{X+Y}{\sqrt2},\qquad V=\frac{X-Y}{\sqrt2}.$$` },
      { title: 'Канонический вид', body: String.raw`После сдвига уравнение равно
$$-3X^2+10XY-3Y^2=8,$$
а после поворота — $2U^2-8V^2=8$, то есть
$$\frac{U^2}{4}-V^2=1.$$` },
      { title: 'Геометрия и обратная проверка', body: String.raw`Это гипербола: $a=2$, $b=1$, $c=\sqrt5$, $e=\sqrt5/2$, асимптоты $V=\pm U/2$. Обратно
$$x=1+\frac{U+V}{\sqrt2},\qquad y=-2+\frac{U-V}{\sqrt2}.$$
Подстановка этих выражений в исходный многочлен даёт $2U^2-8V^2-8$, что эквивалентно каноническому уравнению.` },
    ], answer: String.raw`При $U=(x+y+1)/\sqrt2$, $V=(x-y-3)/\sqrt2$ получаем $U^2/4-V^2=1$. Центр $(1,-2)$, $a=2$, $b=1$, $e=\sqrt5/2$.` },
    verification: [String.raw`$Q=(q_1\ q_2)$ удовлетворяет $Q^TQ=I$ и $Q^TBQ=\operatorname{diag}(2,-8)$.`, String.raw`Обратная подстановка даёт ровно $2U^2-8V^2-8=0$.`],
    commonMistakes: [String.raw`Поместить коэффициент $10$ целиком во внедиагональные элементы вместо $5$.`, String.raw`Смешать формулы прямого и обратного поворота или потерять сдвиг центра.`],
    selfCheck: [{ prompt: String.raw`Почему это гипербола?`, answer: 'Квадратичные коэффициенты в каноническом виде имеют разные знаки.', explanation: String.raw`Уравнение $U^2/4-V^2=1$ имеет две ветви.` }, { prompt: String.raw`Каковы вершины в исходных координатах?`, answer: String.raw`$(1\pm\sqrt2,-2\pm\sqrt2)$ с согласованными знаками.`, explanation: String.raw`В канонических координатах вершины $(U,V)=(\pm2,0)$, затем применяется обратное преобразование.` }],
  },
];

export default examGeneratedVariantsB;
