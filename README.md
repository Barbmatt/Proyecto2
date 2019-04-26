# Proyecto 1 - _Una Escena. Modelado e Interacción_

En este proyecto deberán generar una escena que puede ser parte o no del proyecto integrador. Se requiere que en la misma se integren, como mínimo, dos objetos. Uno de ellos debe encontrarse en línea (por ejemplo, en los sitios web que proporcionamos) y el otro debe ser creado por ustedes mismos, ya sea usando software _ad-hoc_ o utilizando código. Tengan en cuenta que pueden tener que ajustar los parámetros de la cámara para que sus objetos sean visibles.

En lo que respecta a la interacción con la escena deberán permitir que:

- Los modelos puedan rotar sobre sí mismos cuando sean seleccionados (por lo menos uno debe girar en sentido horario y otro en sentido anti-horario). Sólo rotará un objeto en la escena en un determinado momento. También podrá rotar uno alrededor de otro.
- La cámara pueda moverse en la escena. Ésta tendrá 2 tipos de movimientos diferentes:
    - Alrededor de la escena, sin control del usuario
    - Manualmente en la escena (haciendo paneo, zoom y yendo hacia arriba y hacia abajo)

## 1. Objetivo

En este trabajo se familiarizarán con el proceso de tomar un objeto geométrico, ya sea uno que hayan encontrado en la Web u otro que hayan creado y colocarlo/s en una escena. Además, considerarán la observación de la escena desde distintos puntos de vista para lo que deberán poder manipular una cámara. Estos son los primeros pasos hacia la creación de la escena del proyecto integrador.

## 2. Los Modelos

Se pueden encontrar redes de modelos de objetos online. Algunos lugares son:
- [TurboSquid](​http://www.turbosquid.com/)
- [PolyCount](​http://www.polycount.com/forum/​)
- [TF3DM​](​http://tf3dm.com/​)

Se pueden crear modelos propios de objetos con los programas que se vieron en clase. Algunas de éstas opciones son (pueden consultar la teoría para ver más alternativas):
- [Blender​](https://www.blender.org/)
- [Autodesk Maya​](http://www.autodesk.com/education/free-software/maya)
- [Autodesk 3ds Max​](http://www.autodesk.com/education/free-software/3ds-max)
- Sketch-Up
- etc

Deben asegurarse que las redes que encuentren puedan cargarlas.
Es altamente recomendable que usen el formato OBJ. También es muy recommendable que se interioricen con él.

## 3. Background

Para esta tarea, utilizarán modelos _​wireframe_.​ En lo que se refiere a ​shaders​, sólo deberán modificar el de vértices. No es necesario que cada objeto tenga colores diferentes. Puede usarse un color por defecto para ambos.

En este Proyecto van a utilizar funciones que les permitan:
- Cargar y hacer el _​setup_ de los _​shaders​_.
- Cargar una red poligonal y adicionarla a la escena.

Se debe tener cuidado con dónde está ubicada la cámara con respecto a los modelos porque puede estar mal ubicada. Generalmente, esto significa que puede estar dentro del modelo, no apuntar al mismo o el modelo puede no estar dentro del _​frustum​_ de visión.
Los modelos deben estar guardados en una carpeta ```\modelos.```

## 4. Extras

Se detallan algunas sugerencias para superar lo mínimo necesario para completar este Proyecto. ¡Sólo intenten hacer esto una vez que hayan cumplido con los requerimientos mínimos para el proyecto!

- _3D ​Scanning_ - Una tendencia reciente es el uso de cámaras de celulares o tabletas para escanear un objeto del mundo real y crear un modelo 3D. Se puede utilizar software existente para reconstruir la geometría a partir de múltiples imágenes. Puede ser útil procesar la malla con _MeshLab_ p​ara eliminar cualquier parte de la malla que tenga agujeros y así cerrarla o para volver a utilizar el modelo escaneado. Puede ser que la aplicación de escaneo les permita adquirir colores de vértices o una textura para la malla. Será útil guardar toda esta información para usarla en un proyecto posterior si deciden usar esa malla para el proyecto integrador.
- Incorporación de métodos de modelado/generación de objetos vistos en las clases teóricas.
- Pueden implementar recorridos libres de la cámara no contemplados en el presente proyecto.

## 5. Calificación

El Proyecto será calificado de acuerdo a las rúbricas proporcionadas en la sección 5.2. Se presentan rúbricas para la evaluación de:
- Aspectos cognitivos
- Sketch
- Trabajo en equipo
- Presentación

Para aprobar el proyecto ninguno de los ítems evaluados debe ser insuficiente. La nota se integrará considerando todos los requerimientos exigidos.

### 5.1 Modelo calificado

Los modelos proporcionados o creados por la cátedra para la explicación de los temas no contarán para este requisito.
Cualquier modelo que se encuentre en la Web o que ustedes mismos creen o generen debe ser más complejo que una simple primitiva geométrica (por ejemplo, esfera, cubo, plano, cónica, etc.) o una combinación trivial de múltiples primitivas geométricas (por ejemplo, dos esferas apiladas una encima de la otra). No recibirán crédito por objetos que se puedan hacer con modificaciones triviales de algún paquete o programa de modelado 3D. Cualquier transformación no rígida (es decir, cualquier deformación que no sea sólo una escala, traslación o rotación de la malla) se considerará una modificación no trivial. Si estos requisitos no están del todo claros, pregunten a los auxiliares de la cátedra para que le proporcione orientación de cómo hacerlo. También tengan en cuenta que el objetivo no es que encuentren, creen o generen obras maestras a partir de las mallas.

### 5.2 Rúbricas

Disponibles en la version PDF de esta consigna accesible via [Moodle](https://moodle.uns.edu.ar/moodle).




