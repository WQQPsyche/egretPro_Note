
`fs-extra` + `.glob()` (fast-glob) + `.saferRemove()` (from basedir by default)



### Changelogs

- 0.3.0: Simplified, and completely re-written. Just focused on what we often add on top of fs-extra. Right now, just `.glob()` (fast-glob) and `.saferRemove()`


### example

```ts
import * as fs from 'fs-extra-plus';


async function example(){

  // can use the normal fs-extra function
  await fs.ensureDir('/tmp/my-temp/');
  await fs.copy('/tmp/myfile', '/tmp/my-temp/mynewfile')

  // fs-extra-plus glob (using fast-glob)
  const files = await fs.glob('**/*.js');

  const files = await fs.glob(['**/*.js', '**/*.css'], 'src/'); 
  // Note that when cwd, the return files will have the cwd in the path
  // e.g., files[0] === 'src/some.ts' (and not as 'some.ts' as in raw fast-glob)
  
  // or full fast-glob options 
  const files = await fs.glob(['**/*.js', '**/*.css'], {cwd: 'src/', deep: 3});
  
  // fs-extra-plus saferRemove
  fs.saferRemove('../somedir'); // >> Throw error, seems not safe, does not belong to current dir
  fs.saferRemove('/etc/'); // >> Throw error, seems not safe, does not belong to current dir
  fs.saferRemove('some-file-in-basedir'); // >> will delete
  fs.saferRemove(['some-dir/some-file'],'/tmp/'); // >> will delete `some-dir/some-file` from the `/tmp/` dir.
}

```
